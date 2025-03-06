package services

import (
	"Backend/models"
	"database/sql"
)

// Создание новой команды
func CreateTeam(db *sql.DB, team models.Team) error {
	return db.QueryRow(`INSERT INTO "ViTask"."team" (team_name) VALUES ($1) RETURNING team_id`, team.TeamName).
}

// Получение всех команд пользователя
func GetTeamsByUserID(db *sql.DB, userID int) ([]models.Team, error) {
	var teams []models.Team
	rows, err := db.Query(`SELECT t.team_id, t.team_name FROM "ViTask"."team" t 
        JOIN "ViTask"."user" u ON t.team_id = u.team_id WHERE u.user_id = $1`, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var team models.Team
		if err := rows.Scan(&team.TeamID, &team.TeamName); err != nil {
			return nil, err
		}
		teams = append(teams, team)
	}

	return teams, nil
}
