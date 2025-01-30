package main

import (
	"fmt"
	"log"
	"net/http"
	"time"
)

func main() {
	http.HandleFunc("/", switchHandler)
	fmt.Println("Server is running on http://localhost:3000")
	log.Fatal(http.ListenAndServe(":3000", nil))
}

func switchHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println(time.ANSIC, r.URL.Path)
	switch r.URL.Path {
	case "/api/slides":
		slidesHandler(w, r)
	case "/":
		fmt.Fprintf(w, "Welcome to the homepage!")

	case "/about":
		fmt.Fprintf(w, "Welcome to the about page!")
	default:
		http.Error(w, "404 Not Found", http.StatusNotFound)
	}
}
