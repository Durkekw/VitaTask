package handlers

import (
	"Backend/database"
	"database/sql"
	"encoding/json"
	"net/http"
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
		defer tx.Rollback() // Откат транзакции в случае ошибки

		// Создаем команду и присваиваем создателю роль "Manager" (role_id = 1)
		var teamID int
		err = tx.QueryRow(
			`INSERT INTO "ViTask"."team" (team_name, role_id) VALUES ($1, $2) RETURNING team_id`,
			request.TeamName, 1, // role_id = 1 (Manager)
		).Scan(&teamID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		// Обновляем данные пользователя, присваивая ему role_id и team_id
		_, err = tx.Exec(
			`UPDATE "ViTask"."user" SET role_id = $1, team_id = $2 WHERE user_id = $3`,
			1, teamID, request.UserID, // role_id = 1 (Manager), team_id = ID созданной команды
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

		// Возвращаем teamId в виде строки
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(map[string]int{"teamId": teamID})
	}
}

func AddUserToTeamHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var request struct {
			UserID int `json:"user_id"`
			TeamID int `json:"team_id"`
		}
		err := json.NewDecoder(r.Body).Decode(&request)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		// Присваиваем пользователю роль "Employee" при добавлении в команду
		_, err = db.Exec(`UPDATE "ViTask"."user" SET role_id = 2 WHERE user_id = $1`, request.UserID) // 2 - Employee
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		err = database.AddUserToTeam(db, request.UserID, request.TeamID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]string{"message": "User added to team successfully"})
	}
}
