package database

import (
	"Backend/models"
	"database/sql"
	"fmt"
	_ "github.com/lib/pq" // Импортируем драйвер PostgreSQL
	"log"
)

// ConnectDB создает и возвращает соединение с базой данных.
// Если подключение не удалось, программа завершится с ошибкой.
func ConnectDB() *sql.DB {
	// Параметры подключения к базе данных
	psqlInfo := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
		"localhost", // Хост (например, localhost)
		5432,        // Порт (по умолчанию 5432)
		"postgres",  // Имя пользователя (например, postgres)
		"110",       // Пароль пользователя
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
	_, err := db.Exec(`INSERT INTO "ViTask"."team" (team_name) VALUES ($1)`,
		team.TeamName)
	return err
}

func GetUserByEmail(db *sql.DB, email string) (*models.User, error) {
	var user models.User
	row := db.QueryRow(`SELECT email, password FROM "ViTask"."user" WHERE email = $1`, email)
	err := row.Scan(&user.Email, &user.Password)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil // Пользователь не найден
		}
		return nil, err // Ошибка базы данных
	}
	return &user, nil
}
