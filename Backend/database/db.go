package database

import (
	"Backend/models"
	"database/sql"
	"fmt"
	_ "github.com/lib/pq" // Импортируем драйвер PostgreSQL
	"log"
	"time"
)

// ConnectDB создает и возвращает соединение с базой данных.
// Если подключение не удалось, программа завершится с ошибкой.
func ConnectDB() *sql.DB {
	// Параметры подключения к базе данных
	psqlInfo := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
		"localhost", // Хост (например, localhost)
		5432,        // Порт (по умолчанию 5432)
		"postgres",  // Имя пользователя (например, postgres)
		"1",         // Пароль пользователя
		"postgres",  // Имя базы данных
	)

	// Подключение к базе данных
	db, err := sql.Open("postgres", psqlInfo)
	if err != nil {
		log.Fatalf("Error: Unable to connect to database: %v", err)
	}

	// Проверка соединения с базой данных
	err = db.Ping()
	if err != nil {
		log.Fatalf("Error: Unable to ping database: %v", err)
	}

	fmt.Println("Successfully connected to the database")
	return db
}

func CreateUser(db *sql.DB, user models.User) error {
	_, err := db.Exec(`INSERT INTO "ViTask"."user" (email, password, name, surname) VALUES ($1, $2, $3, $4)`,
		user.Email, user.Password, user.Name, user.Surname)
	return err
}

func CreateTeam(db *sql.DB, team models.Team) error {
	_, err := db.Exec(`INSERT INTO "ViTask"."team" (team_name, role_id) VALUES ($1, $2) RETURNING team_id`,
		team.TeamName, team.RoleID)
	return err
}

func AddUserToTeam(db *sql.DB, userID, teamID int) error {
	_, err := db.Exec(`INSERT INTO "ViTask"."user_team" (user_id, team_id) VALUES ($1, $2)`,
		userID, teamID)
	return err
}

func DeleteFromTeam(db *sql.DB, userId int, teamID int) error {
	_, err := db.Exec(`DELETE FROM "ViTask"."user_team" WHERE user_id = $1 AND team_id = $2`, userId, teamID)
	if err != nil {
		log.Printf("Failed to delete user %d from team %d: %v", userId, teamID, err)
	}
	return err
}

func GetUserByEmail(db *sql.DB, email string) (*models.User, error) {
	var user models.User
	row := db.QueryRow(`SELECT user_id, email, password, name, surname, team_id, role_id FROM "ViTask"."user" WHERE email = $1`, email)
	err := row.Scan(&user.UserID, &user.Email, &user.Password, &user.Name, &user.Surname, &user.TeamID, &user.RoleID)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil // Пользователь не найден
		}
		return nil, err // Ошибка базы данных
	}
	return &user, nil
}

func GetTeams(db *sql.DB) ([]models.Team, error) {
	rows, err := db.Query(`SELECT team_id, team_name FROM "ViTask"."team"`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var teams []models.Team
	for rows.Next() {
		var team models.Team
		err := rows.Scan(&team.TeamID, &team.TeamName)
		if err != nil {
			return nil, err
		}
		teams = append(teams, team)
	}
	return teams, nil
}

func GetTeamByID(db *sql.DB, teamID int) (*models.Team, error) {
	var team models.Team
	row := db.QueryRow(`SELECT team_id, team_name FROM "ViTask"."team" WHERE team_id = $1`, teamID)
	err := row.Scan(&team.TeamID, &team.TeamName)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil // Команда не найдена
		}
		return nil, err // Ошибка базы данных
	}
	return &team, nil
}

func GetTasksByTeamID(db *sql.DB, teamID int) ([]models.Task, error) {
	rows, err := db.Query(`
        SELECT 
            t.task_id, 
            t.task_title, 
            t.task_description, 
            t.task_status, 
            t.deadline, 
            t.created_at, 
            t.team_id, 
            t.user_id,
            u.name,
            u.surname
        FROM "ViTask"."task" t
        INNER JOIN "ViTask"."user" u ON t.user_id = u.user_id
        WHERE t.team_id = $1
    `, teamID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var tasks []models.Task
	for rows.Next() {
		var task models.Task
		var deadline, createdAt time.Time

		err := rows.Scan(
			&task.TaskID,
			&task.TaskTitle,
			&task.TaskDesc,
			&task.TaskStatus,
			&deadline,
			&createdAt,
			&task.TeamId,
			&task.UserID,
			&task.Name,
			&task.Surname,
		)
		if err != nil {
			return nil, err
		}

		task.Deadline = deadline.Format("2006-01-02")
		task.CreatedAt = createdAt.Format("2006-01-02")

		tasks = append(tasks, task)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return tasks, nil
}

func GetUserByID(db *sql.DB, userID int) (*models.User, error) {
	var user models.User
	row := db.QueryRow(`SELECT user_id, email, name, surname, team_id, role_id FROM "ViTask"."user" WHERE user_id = $1`, userID)
	err := row.Scan(&user.UserID, &user.Email, &user.Name, &user.Surname, &user.TeamID, &user.RoleID)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil // Пользователь не найден
		}
		return nil, err // Ошибка базы данных
	}
	return &user, nil
}

func GetTaskComments(db *sql.DB, taskID int) ([]models.TaskComment, error) {
	rows, err := db.Query(
		`SELECT task_comment_id, task_comment_content, task_id, user_id 
		 FROM "ViTask"."task_comment" 
		 WHERE task_id = $1 
		 ORDER BY task_comment_id ASC`,
		taskID,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var comments []models.TaskComment
	for rows.Next() {
		var comment models.TaskComment
		err := rows.Scan(&comment.TaskCommentID, &comment.TaskCommentContent, &comment.TaskID, &comment.UserID)
		if err != nil {
			return nil, err
		}
		comments = append(comments, comment)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return comments, nil
}

func AddTaskComment(db *sql.DB, comment models.TaskComment) error {
	_, err := db.Exec(
		`INSERT INTO "ViTask"."task_comment" (task_comment_content, task_id, user_id) 
		 VALUES ($1, $2, $3)`,
		comment.TaskCommentContent, comment.TaskID, comment.UserID,
	)
	return err
}

func UpdateTask(db *sql.DB, taskID int, taskTitle, taskDescription, taskStatus, deadline string, userID int) error {
	// Парсинг даты
	var parsedDate time.Time
	var err error
	if deadline != "" {
		parsedDate, err = time.Parse("2006-01-02", deadline)
		if err != nil {
			return fmt.Errorf("invalid date format: %v", err)
		}
	}

	// Обновляем задачу в базе данных
	query := `
        UPDATE "ViTask"."task"
        SET task_title = $1,
            task_description = $2,
            task_status = $3,
            deadline = $4,
            user_id = $5
        WHERE task_id = $6
    `
	_, err = db.Exec(query, taskTitle, taskDescription, taskStatus, parsedDate, userID, taskID)
	if err != nil {
		return fmt.Errorf("failed to update task: %v", err)
	}

	return nil
}

func AddMessage(db *sql.DB, userID, chatID int, content string) (int, time.Time, error) {
	query := `
        INSERT INTO "ViTask"."messenger" (user_id, chat_id, content, date_create)
        VALUES ($1, $2, $3, NOW())
        RETURNING message_id, date_create
        `
	var messageID int
	var createdAt time.Time
	err := db.QueryRow(query, userID, chatID, content).Scan(&messageID, &createdAt)
	if err != nil {
		log.Printf("Failed to add message: %v", err)
		return 0, time.Time{}, err
	}

	return messageID, createdAt, nil
}

// Получение сообщений из чата
func GetMessagesByChatID(db *sql.DB, chatID int) ([]models.Message, error) {
	rows, err := db.Query(`
        SELECT message_id, user_id, content, date_create
        FROM "ViTask"."messenger"
        WHERE chat_id = $1
        ORDER BY date_create ASC
    `, chatID)
	if err != nil {
		log.Printf("Error fetching messages: %v", err)
		return nil, fmt.Errorf("failed to fetch messages: %v", err)
	}
	defer rows.Close()

	var messages []models.Message
	for rows.Next() {
		var message models.Message
		var createdAt time.Time // Переменная для хранения времени из базы данных
		err := rows.Scan(&message.MessageID, &message.UserID, &message.Content, &createdAt)
		if err != nil {
			log.Printf("Error scanning message: %v", err)
			return nil, fmt.Errorf("failed to scan message: %v", err)
		}

		// Преобразуем время в формат "ЧЧ:ММ"
		message.CreatedAt = createdAt.Format("15:04")
		messages = append(messages, message)
	}

	if err = rows.Err(); err != nil {
		log.Printf("Error after scanning rows: %v", err)
		return nil, fmt.Errorf("error after scanning rows: %v", err)
	}

	// Если сообщений нет, возвращаем пустой массив
	if len(messages) == 0 {
		return []models.Message{}, nil
	}

	return messages, nil
}

// Создание нового чата
func CreateChat(db *sql.DB, userID int, chatName string) (int, error) {
	var chatID int
	err := db.QueryRow(`
        INSERT INTO "ViTask"."chat" (user_id, chat_name)
        VALUES ($1, $2)
        RETURNING chat_id
    `, userID, chatName).Scan(&chatID)
	if err != nil {
		log.Printf("Error creating chat: %v", err) // Логируем ошибку
		return 0, fmt.Errorf("failed to create chat: %v", err)
	}
	return chatID, nil
}

// Получение чата по ID
func GetChatByID(db *sql.DB, chatID int) (*models.Chat, error) {
	var chat models.Chat
	err := db.QueryRow(`
        SELECT chat_id, user_id, chat_name
        FROM "ViTask"."chat"
        WHERE chat_id = $1
    `, chatID).Scan(&chat.ChatID, &chat.UserID, &chat.ChatName)
	if err != nil {
		return nil, err
	}
	return &chat, nil
}

// Получение чата между двумя пользователями
func GetChatBetweenUsers(db *sql.DB, user1ID, user2ID int) (*models.Chat, error) {
	var chat models.Chat
	err := db.QueryRow(`
        SELECT c.chat_id, c.user_id, c.chat_name
        FROM "ViTask"."chat" c
        JOIN "ViTask"."party" p ON c.chat_id = p.chat_id
        WHERE p.user_id IN ($1, $2)
        GROUP BY c.chat_id
        HAVING COUNT(DISTINCT p.user_id) = 2
    `, user1ID, user2ID).Scan(&chat.ChatID, &chat.UserID, &chat.ChatName)
	if err != nil {
		if err == sql.ErrNoRows {
			log.Printf("No chat found between users %d and %d", user1ID, user2ID) // Логируем, если чат не найден
			return nil, nil
		}
		log.Printf("Error fetching chat between users %d and %d: %v", user1ID, user2ID, err) // Логируем ошибку
		return nil, fmt.Errorf("failed to get chat between users: %v", err)
	}
	log.Printf("Chat found between users %d and %d: %+v", user1ID, user2ID, chat) // Логируем найденный чат
	return &chat, nil
}

// Добавление пользователя в чат
func AddUserToChat(db *sql.DB, chatID, userID int) error {
	// Проверяем входные данные
	if chatID <= 0 || userID <= 0 {
		return fmt.Errorf("invalid chatID or userID: chatID=%d, userID=%d", chatID, userID)
	}

	// Проверяем, существует ли уже запись
	var exists bool
	err := db.QueryRow(`
        SELECT EXISTS (
            SELECT 1
            FROM "ViTask"."party"
            WHERE chat_id = $1 AND user_id = $2
        )
    `, chatID, userID).Scan(&exists)
	if err != nil {
		return fmt.Errorf("failed to check if user is already in chat (chatID=%d, userID=%d): %v", chatID, userID, err)
	}

	if exists {
		log.Printf("User %d is already in chat %d", userID, chatID)
		return nil // Пользователь уже в чате
	}

	// Добавляем пользователя в чат
	_, err = db.Exec(`
        INSERT INTO "ViTask"."party" (chat_id, user_id)
        VALUES ($1, $2)
    `, chatID, userID)
	if err != nil {
		return fmt.Errorf("failed to add user to chat (chatID=%d, userID=%d): %v", chatID, userID, err)
	}

	log.Printf("User %d successfully added to chat %d", userID, chatID)
	return nil
}

func GetUsersWithChats(db *sql.DB, currentUserID int) ([]models.UserWithChat, error) {
	rows, err := db.Query(`
        SELECT DISTINCT u.user_id, u.email, u.name, u.surname, u.team_id, u.role_id, p.chat_id
        FROM "ViTask"."party" p
        JOIN "ViTask"."user" u ON p.user_id = u.user_id
        WHERE p.chat_id IN (
            SELECT chat_id
            FROM "ViTask"."party"
            WHERE user_id = $1
        ) AND p.user_id != $1
    `, currentUserID)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch users with chats: %v", err)
	}
	defer rows.Close()

	var users []models.UserWithChat
	for rows.Next() {
		var user models.UserWithChat
		err := rows.Scan(&user.UserID, &user.Email, &user.Name, &user.Surname, &user.TeamID, &user.RoleID, &user.ChatID)
		if err != nil {
			return nil, fmt.Errorf("failed to scan user: %v", err)
		}
		users = append(users, user)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("error after scanning rows: %v", err)
	}

	return users, nil
}
