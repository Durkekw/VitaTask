package models

type Chat struct {
	ChatID   int    `json:"chat_id"`
	UserID   int    `json:"user_id"` // ID пользователя, создавшего чат
	ChatName string `json:"chat_name"`
}
