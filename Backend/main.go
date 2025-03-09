package main

import (
	"Backend/database"
	"Backend/handlers"
	"github.com/gorilla/mux"
	_ "github.com/lib/pq"
	"github.com/rs/cors"
	"log"
	"net/http"
)

func main() {
	db := database.ConnectDB()
	defer db.Close()

	r := mux.NewRouter()

	// Регистрация маршрутов
	r.HandleFunc("/register", handlers.RegisterHandler(db)).Methods("POST")
	r.HandleFunc("/login", handlers.LoginHandler(db)).Methods("POST")
	r.HandleFunc("/create-team", handlers.CreateTeamHandler(db)).Methods("POST")
	r.HandleFunc("/add-user-to-team", handlers.AddUserToTeamHandler(db)).Methods("POST")
	r.HandleFunc("/team/{teamId}/members", handlers.GetTeamMembersHandler(db)).Methods("GET")
	r.HandleFunc("/unteamed-users", handlers.GetUnteamedUsersHandler(db)).Methods("GET")

	// Настройка CORS
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5174"}, // Разрешенный origin (ваш React-сервер)
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	})

	handler := c.Handler(r)

	log.Println("Server started on :8080")
	log.Fatal(http.ListenAndServe(":8080", handler))
}
