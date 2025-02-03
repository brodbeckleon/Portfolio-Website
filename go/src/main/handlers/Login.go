package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
)

type Credentials struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func LoginHandler(w http.ResponseWriter, r *http.Request) {
	// Add CORS headers
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	fmt.Println("LoginHandler called")

	if r.Method == http.MethodPost {
		var creds Credentials
		if err := json.NewDecoder(r.Body).Decode(&creds); err != nil {
			http.Error(w, "Invalid request payload", http.StatusBadRequest)
			return
		}

		// Replace with real authentication logic
		if creds.Email == "brodbeckleon@gmail.com" && creds.Password == "secret" {
			w.Header().Set("Content-Type", "application/json")
			w.Write([]byte(`{"token": "fakejwt123"}`))
			return
		} else {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}
	}

	if r.Method == http.MethodGet {
		// Possibly serve a login form or similar
		fmt.Fprintf(w, "Provide credentials via POST.")
		return
	}

	http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
}
