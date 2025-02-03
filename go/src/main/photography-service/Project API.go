package photography_service

import "net/http"

func CreateProject(c *gin.Context) {
	password, _ := utils.GenerateRandomPassword(12)

	project := models.Project{
		ProjectID: "project123",                 // Generate unique project IDs (e.g., UUID)
		Password:  utils.HashPassword(password), // Hash the password before saving
	}

	if err := models.DB.Create(&project).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not create project"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"project_id": project.ProjectID,
		"password":   password, // Return the password to the admin (to share with the client)
	})
}
