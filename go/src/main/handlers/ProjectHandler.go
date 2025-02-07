package handlers

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
)

const galleryFolder = "/galleries"
const galleryPath = ImagesFolder + galleryFolder

type Project struct {
	ID          uint     `json:"id"`
	ProjectName string   `json:"projectName"`
	Password    string   `json:"password"`
	Images      []string `json:"images"`
}

func getProjects() []Project {
	entries, err := os.ReadDir(galleryPath)
	if err != nil {
		log.Println("Error reading directory:", err)
		return []Project{}
	}

	var projects []Project
	for _, entry := range entries {
		if entry.IsDir() {
			projectFilePath := filepath.Join(galleryPath, entry.Name(), "project.json")
			file, err := os.Open(projectFilePath)
			if err != nil {
				log.Println("Error opening project file:", err)
				continue
			}
			defer file.Close()

			var project Project
			if err := json.NewDecoder(file).Decode(&project); err != nil {
				log.Println("Error decoding project file:", err)
				continue
			}

			projects = append(projects, project)
		}
	}

	log.Println("Projects found", projects)
	return projects
}

func getProject(id uint) Project {
	projects := getProjects()

	for _, project := range projects {
		if project.ID == id {
			log.Println("Project found", project)
			return project
		}
	}
	log.Println("Project not found")
	return Project{}
}

func getHighestID() uint {
	entries, err := os.ReadDir(galleryPath)
	if err != nil {
		log.Println("Error reading directory:", err)
		return 0
	}

	maxNumber := 0
	for _, entry := range entries {
		if entry.IsDir() {
			name := entry.Name()
			log.Println("Processing directory:", name)
			var id int
			if idx := strings.Index(name, "_"); idx != -1 {
				id, _ = strconv.Atoi(name[:idx])
			} else {
				id, err = strconv.Atoi(name)
				if err != nil {
					log.Println("Error converting directory name to number:", err)
					continue
				}
			}

			log.Println("Extracted ID:", id)
			if id > maxNumber {
				maxNumber = id
			}
		}
	}

	log.Println("Highest ID found:", maxNumber)
	return uint(maxNumber) + 1
}

func FetchProjects(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(getProjects()); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func AddProject(w http.ResponseWriter, r *http.Request) {
	var nextID uint = getHighestID()

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
	projectDir := filepath.Join(galleryPath, strconv.Itoa(int(project.ID))+"_"+project.ProjectName)
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

		imageName := filepath.Join(strconv.Itoa(int(project.ID))+"_"+project.ProjectName, fileHeader.Filename)
		project.Images = append(project.Images, imageName)
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

	w.WriteHeader(http.StatusCreated)
	log.Println(w, "Project added successfully")
}

func DeleteProject(w http.ResponseWriter, r *http.Request) {
	//TODO: Implement
}

func UpdateProject(w http.ResponseWriter, r *http.Request) {
	//TODO: Implement
}

func FetchProject(w http.ResponseWriter, r *http.Request) {
	projectId := r.URL.Query().Get("projectId")
	if projectId == "" {
		http.Error(w, "Project ID is required", http.StatusBadRequest)
		return
	}

	id, err := strconv.Atoi(projectId)
	if err != nil {
		http.Error(w, "Invalid project ID", http.StatusBadRequest)
		return
	}

	var project Project = getProject(uint(id))
	projectFilePath := filepath.Join(galleryPath, projectId+"_"+project.ProjectName, "project.json")

	file, err := os.Open(projectFilePath)
	if err != nil {
		http.Error(w, "Project not found", http.StatusNotFound)
		return
	}
	defer file.Close()
	if err := json.NewDecoder(file).Decode(&project); err != nil {
		http.Error(w, "Error decoding project file", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(project); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
	log.Println("Project fetched", project)
}
