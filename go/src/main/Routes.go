package main

import (
	"go.mod/src/main/handlers"
	"net/http"
	"os"
	"path/filepath"
)

func registerRoutes(mux *http.ServeMux) {
	// 1) Serve compiled Vite build from "dist" folder
	distPath := filepath.Join(".", "dist")
	if _, err := os.Stat(distPath); os.IsNotExist(err) {
		// If dist doesn't exist, maybe we're in development mode
		// In dev, you'd just rely on Vite's dev server, so you might do nothing here
		// or provide a placeholder.
		// For production, make sure `dist` is built.
	} else {
		fileServer := http.FileServer(http.Dir(distPath))
		mux.Handle("/", fileServer)
	}

	mux.HandleFunc("/api/slides", handlers.SlidesHandler)
	mux.HandleFunc("/api/image", handlers.ServeImage)
	//TODO
	mux.HandleFunc("/api/downloadZip", handlers.ServeZipFile)
	mux.HandleFunc("/api/login", handlers.LoginHandler)
	mux.HandleFunc("/api/fetchProjects", handlers.FetchProjects)
	mux.HandleFunc("/api/fetchProject", handlers.FetchProject)
	mux.HandleFunc("/api/addProject", handlers.AddProject)
	mux.HandleFunc("/api/deleteProject/", handlers.DeleteProject)
	//TODO
	mux.HandleFunc("/api/updateProject", handlers.UpdateProject)
}
