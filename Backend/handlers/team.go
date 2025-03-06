package handlers

import (
	"Backend/database"
	"Backend/models"
	"database/sql"
	"encoding/json"
	"net/http"
)

func CreateTeamHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var team models.Team
		err := json.NewDecoder(r.Body).Decode(&team)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		// Создаем команду и присваиваем создателю роль "Manager"
		team.RoleID = 1 // 1 - Manager
		err = database.CreateTeam(db, team)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(map[string]string{"message": "Team created successfully"})
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
