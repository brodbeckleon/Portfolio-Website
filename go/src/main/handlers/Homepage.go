package handlers

import (
	"log"
	"net/http"
)

// HomePageHandler handles the root path `/`
func HomePageHandler(w http.ResponseWriter, r *http.Request) {
	log.Println(w, "Welcome to the homepage!")
}
