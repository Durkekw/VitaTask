package handlers

import (
	"Backend/database"
	"Backend/models"
	"database/sql"
	"encoding/json"
	"github.com/gorilla/mux"
	"log"
	"net/http"
	"strconv"
)

func CreateTeamHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var request struct {
			TeamName string `json:"teamName"`
			UserID   int    `json:"userId"`
		}
		err := json.NewDecoder(r.Body).Decode(&request)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		if request.UserID == 0 {
			http.Error(w, "User ID is required", http.StatusBadRequest)
			return
		}

		// Начинаем транзакцию
		tx, err := db.Begin()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer tx.Rollback()

		// Создаем команду
		var teamID int
		err = tx.QueryRow(
			`INSERT INTO "ViTask"."team" (team_name, role_id) VALUES ($1, $2) RETURNING team_id`,
			request.TeamName, 1, // role_id = 1 (Менеджер)
		).Scan(&teamID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		// Обновляем роль пользователя на "Manager" (role_id = 1)
		_, err = tx.Exec(
			`UPDATE "ViTask"."user" SET role_id = 1 WHERE user_id = $1`,
			request.UserID,
		)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		// Обновляем team_id пользователя
		_, err = tx.Exec(
			`UPDATE "ViTask"."user" SET team_id = $1 WHERE user_id = $2`,
			teamID, request.UserID,
		)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		// Добавляем пользователя в команду через таблицу user_team
		_, err = tx.Exec(
			`INSERT INTO "ViTask"."user_team" (user_id, team_id) VALUES ($1, $2)`,
			request.UserID, teamID,
		)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		// Завершаем транзакцию
		err = tx.Commit()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(map[string]int{"teamId": teamID})
	}
}

func AddUserToTeamHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Println("AddUserToTeamHandler called") // Логируем вызов

		var request struct {
			UserID int `json:"user_id"`
			TeamID int `json:"team_id"`
		}
		err := json.NewDecoder(r.Body).Decode(&request)
		if err != nil {
			log.Printf("Error decoding request: %v", err) // Логируем ошибку
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		log.Printf("Received request: UserID=%d, TeamID=%d", request.UserID, request.TeamID)

		// Проверяем, существует ли пользователь
		var exists bool
		err = db.QueryRow(`SELECT EXISTS(SELECT 1 FROM "ViTask"."user" WHERE user_id = $1)`, request.UserID).Scan(&exists)
		if err != nil || !exists {
			log.Printf("User with ID %d does not exist", request.UserID)
			http.Error(w, "User does not exist", http.StatusNotFound)
			return
		}

		// Проверяем, существует ли команда
		err = db.QueryRow(`SELECT EXISTS(SELECT 1 FROM "ViTask"."team" WHERE team_id = $1)`, request.TeamID).Scan(&exists)
		if err != nil || !exists {
			log.Printf("Team with ID %d does not exist", request.TeamID)
			http.Error(w, "Team does not exist", http.StatusNotFound)
			return
		}

		// Присваиваем пользователю роль "Employee" при добавлении в команду
		_, err = db.Exec(`UPDATE "ViTask"."user" SET role_id = 2 WHERE user_id = $1`, request.UserID) // 2 - Employee
		if err != nil {
			log.Printf("Error updating user role: %v", err)
			http.Error(w, "Failed to update user role", http.StatusInternalServerError)
			return
		}

		// Добавляем пользователя в команду
		err = database.AddUserToTeam(db, request.UserID, request.TeamID)
		if err != nil {
			log.Printf("Error adding user to team: %v", err)
			http.Error(w, "Failed to add user to team", http.StatusInternalServerError)
			return
		}

		// Возвращаем успешный ответ
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]string{"message": "User added to team successfully"})
	}
}

func GetTeamMembersHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Извлечение teamId через gorilla/mux
		vars := mux.Vars(r)
		teamID, ok := vars["teamId"]
		if !ok || teamID == "" {
			log.Println("teamId is empty") // Логируем ошибку
			http.Error(w, "teamId is required", http.StatusBadRequest)
			return
		}

		teamIDInt, err := strconv.Atoi(teamID)
		if err != nil {
			log.Printf("Invalid teamId: %s", teamID) // Логируем ошибку
			http.Error(w, "Invalid teamId", http.StatusBadRequest)
			return
		}

		if teamIDInt <= 0 {
			log.Printf("teamId must be greater than 0: %d", teamIDInt)
			http.Error(w, "teamId must be greater than 0", http.StatusBadRequest)
			return
		}

		rows, err := db.Query(`
            SELECT u.user_id, u.name, u.surname, u.email, u.role_id 
            FROM "ViTask"."user" u
            JOIN "ViTask"."user_team" ut ON u.user_id = ut.user_id
            WHERE ut.team_id = $1`, teamIDInt)
		if err != nil {
			log.Printf("Database error: %v", err) // Логируем ошибку
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		var members []models.User
		for rows.Next() {
			var member models.User
			err := rows.Scan(&member.UserID, &member.Name, &member.Surname, &member.Email, &member.RoleID)
			if err != nil {
				log.Printf("Row scanning error: %v", err) // Логируем ошибку
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			members = append(members, member)
		}

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(members)
	}
}

func GetUnteamedUsersHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		rows, err := db.Query(`
            SELECT user_id, name, surname, email 
            FROM "ViTask"."user" 
            WHERE (team_id IS NULL OR team_id = 0)
        `)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		var users []models.User
		for rows.Next() {
			var user models.User
			err := rows.Scan(&user.UserID, &user.Name, &user.Surname, &user.Email)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			users = append(users, user)
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(users)
	}
}
