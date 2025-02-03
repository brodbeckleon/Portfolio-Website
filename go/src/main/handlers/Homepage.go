package handlers

import (
	"fmt"
	"net/http"
)

// HomePageHandler handles the root path `/`
func HomePageHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprint(w, "Welcome to the homepage!")
}
