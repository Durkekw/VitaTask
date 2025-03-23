package models

import "database/sql"

type UserWithChat struct {
	UserID  int           `json:"user_id"`
	Email   string        `json:"email"`
	Name    string        `json:"name"`
	Surname string        `json:"surname"`
	TeamID  sql.NullInt64 `json:"team_id"`
	RoleID  sql.NullInt64 `json:"role_id"`
	ChatID  int           `json:"chat_id"`
}
