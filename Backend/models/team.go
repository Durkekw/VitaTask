package models

type Team struct {
	TeamID   int    `json:"team_id"`
	TeamName string `json:"team_name"`
	RoleID   int    `json:"role_id"` // Добавьте это поле
	UserID   int    `json:"user_id"`
}
