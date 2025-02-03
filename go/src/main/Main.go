package main

import (
	"fmt"
	"log"
	"net/http"
)

func main() {
	mux := http.NewServeMux()
	registerRoutes(mux)

	fmt.Println("Server running on http://localhost:3000")
	log.Fatal(http.ListenAndServe(":3000", mux))
}
