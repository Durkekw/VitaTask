package models

type Message struct {
	MessageID int    `json:"message_id"`
	UserID    int    `json:"user_id"` // ID пользователя, отправившего сообщение
	Content   string `json:"content"`
	CreatedAt string `json:"created_at"`
}
