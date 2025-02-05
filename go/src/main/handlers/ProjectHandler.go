package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
)

type Project struct {
	ID          uint     `json:"id"`
	ProjectName string   `json:"projectName"`
	Password    string   `json:"password"`
	Images      []string `json:"images"`
}

var projects []Project
var nextID uint = 1

func FetchProjects(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(projects); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func AddProject(w http.ResponseWriter, r *http.Request) {
	if err := r.ParseMultipartForm(10 << 20); err != nil {
		http.Error(w, "Unable to parse form", http.StatusBadRequest)
		return
	}

	projectName := r.FormValue("name")
	if projectName == "" {
		http.Error(w, "Project name is required", http.StatusBadRequest)
		return
	}

	password, err := GenerateRandomPassword(8)
	if err != nil {
		http.Error(w, "Unable to generate password", http.StatusInternalServerError)
		return
	}

	project := Project{
		ID:          nextID,
		ProjectName: projectName,
		Password:    password,
		Images:      []string{},
	}

	images := r.MultipartForm.File["images"]
	projectDir := filepath.Join("images", strconv.Itoa(int(project.ID)))
	if err := os.MkdirAll(projectDir, os.ModePerm); err != nil {
		http.Error(w, "Unable to create project directory", http.StatusInternalServerError)
		return
	}

	for _, fileHeader := range images {
		file, err := fileHeader.Open()
		if err != nil {
			http.Error(w, "Unable to open image file", http.StatusInternalServerError)
			return
		}
		defer file.Close()

		imagePath := filepath.Join(projectDir, fileHeader.Filename)
		out, err := os.Create(imagePath)
		if err != nil {
			http.Error(w, "Unable to create image file", http.StatusInternalServerError)
			return
		}
		defer out.Close()

		if _, err := io.Copy(out, file); err != nil {
			http.Error(w, "Unable to save image file", http.StatusInternalServerError)
			return
		}

		project.Images = append(project.Images, imagePath)
	}

	projectFilePath := filepath.Join(projectDir, "project.json")
	projectFile, err := os.Create(projectFilePath)
	if err != nil {
		http.Error(w, "Unable to create project file", http.StatusInternalServerError)
		return
	}
	defer projectFile.Close()

	if err := json.NewEncoder(projectFile).Encode(project); err != nil {
		http.Error(w, "Unable to save project file", http.StatusInternalServerError)
		return
	}

	projects = append(projects, project)
	nextID++

	w.WriteHeader(http.StatusCreated)
	fmt.Fprint(w, "Project added successfully")
}
