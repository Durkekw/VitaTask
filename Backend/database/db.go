package database

import (
	"Backend/models"
	"database/sql"
	"fmt"
	_ "github.com/lib/pq"
	"log"
)

//const (
//	host     = "localhost"
//	port     = 5432
//	user     = "postgres"
//	password = "1"
//	dbname   = "ViTask"
//)

func ConnectDB() *sql.DB {
	//psqlInfo := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
	//	host, port, user, password, dbname)
	//
	//db, err := sql.Open("postgres", psqlInfo)
	//if err != nil {
	//	panic(err)
	//}
	//
	//err = db.Ping()
	//if err != nil {
	//	panic(err)
	//}
	db, err := sql.Open("postgres", "user=postgres password=1 host=localhost dbname=ViTask sslmode=disable")
	if err != nil {
		log.Fatalf("Error: Unable to connect to database: %v", err)
	}
	//defer db.Close()
	fmt.Println("Successfully connected to the database")
	return db
}

func CreateUser(db *sql.DB, user models.User) error {
	_, err := db.Exec(`INSERT INTO "ViTask"."user" (email, password, name, surname) VALUES ($1, $2, $3, $4)`,
		user.Email, user.Password, user.Name, user.Surname)
	return err
}

func GetUserByEmail(db *sql.DB, email string) (models.User, error) {
	var user models.User
	row := db.QueryRow(`SELECT email, password FROM "ViTask"."user" WHERE email = $1`, email)
	err := row.Scan(&user.Email, &user.Password)
	return user, err
}
