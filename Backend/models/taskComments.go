package models

type TaskComment struct {
	TaskCommentID      int    `json:"task_comment_id"`      // Уникальный идентификатор комментария
	TaskCommentContent string `json:"task_comment_content"` // Текст комментария
	TaskID             int    `json:"task_id"`              // ID задачи, к которой относится комментарий
	UserID             int    `json:"user_id"`              // ID пользователя, оставившего комментарий
	CreatedAt          string `json:"created_at"`           // Дата и время создания комментария
}
