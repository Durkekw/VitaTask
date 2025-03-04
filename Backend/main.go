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

	r.HandleFunc("/register", handlers.RegisterHandler(db)).Methods("POST")
	r.HandleFunc("/login", handlers.LoginHandler(db)).Methods("POST")

	// Настройка CORS
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"}, // Разрешенный origin (ваш React-сервер)
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	})

	handler := c.Handler(r)

	log.Println("Server started on :8080")
	log.Fatal(http.ListenAndServe(":8080", handler))
}
