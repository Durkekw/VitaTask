package models

import "database/sql"

type User struct {
	UserID   int           `json:"user_id"`
	Email    string        `json:"email"`
	Password string        `json:"password"`
	Name     string        `json:"name"`
	Surname  string        `json:"surname"`
	TeamID   sql.NullInt64 `json:"team_id"`
	RoleID   sql.NullInt64 `json:"role_id"`
}
