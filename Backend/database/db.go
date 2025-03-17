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
