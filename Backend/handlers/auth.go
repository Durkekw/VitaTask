package handlers

import (
	"Backend/database"
	"Backend/models"
	"database/sql"
	"encoding/json"
	"golang.org/x/crypto/bcrypt"
	"net/http"
)

func RegisterHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var user models.User
		err := json.NewDecoder(r.Body).Decode(&user)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		// Проверяем, существует ли пользователь с таким email
		existingUser, err := database.GetUserByEmail(db, user.Email)
		if err != nil && err != sql.ErrNoRows {
			http.Error(w, "Database error", http.StatusInternalServerError)
			return
		}
		if existingUser != nil {
			http.Error(w, "Email already exists", http.StatusConflict) // 409 Conflict
			return
		}

		// Хэшируем пароль
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
		if err != nil {
			http.Error(w, "Failed to hash password", http.StatusInternalServerError)
			return
		}
		user.Password = string(hashedPassword)

		// Вставляем пользователя в базу данных и получаем его ID
		var userID int
		err = db.QueryRow(`
            INSERT INTO "ViTask"."user" (email, password, name, surname)
            VALUES ($1, $2, $3, $4)
            RETURNING user_id`,
			user.Email, user.Password, user.Name, user.Surname,
		).Scan(&userID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		// Получаем данные зарегистрированного пользователя
		registeredUser := models.User{
			UserID:  userID,
			Email:   user.Email,
			Name:    user.Name,
			Surname: user.Surname,
			TeamID:  user.TeamID, // По умолчанию team_id = 0 (NULL)
		}

		// Возвращаем данные пользователя
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(registeredUser)
	}
}

func LoginHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var user models.User
		err := json.NewDecoder(r.Body).Decode(&user)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		storedUser, err := database.GetUserByEmail(db, user.Email)
		if err != nil {
			http.Error(w, "User not found", http.StatusUnauthorized)
			return
		}

		err = bcrypt.CompareHashAndPassword([]byte(storedUser.Password), []byte(user.Password))
		if err != nil {
			http.Error(w, "Invalid password", http.StatusUnauthorized)
			return
		}

		// Возвращаем данные пользователя вместо сообщения
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(storedUser) // Возвращаем данные пользователя
	}
}
