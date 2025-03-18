package models

type Task struct {
	TaskID     int    `json:"task_id"`
	TaskTitle  string `json:"task_title"`
	TaskDesc   string `json:"task_description"`
	TaskStatus string `json:"task_status"`
	Deadline   string `json:"deadline"`
	CreatedAt  string `json:"created_at"`
	TeamId     int    `json:"team_id"`
	UserID     int    `json:"user_id"`
}
