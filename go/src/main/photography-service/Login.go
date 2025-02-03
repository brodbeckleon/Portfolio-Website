package photography_service

import "net/http"

func AccessProject(c *gin.Context) {
	var input struct {
		ProjectID string `json:"project_id"`
		Password  string `json:"password"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	var project models.Project
	if err := models.DB.Where("project_id = ?", input.ProjectID).First(&project).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Project not found"})
		return
	}

	if !utils.CheckPassword(project.Password, input.Password) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Incorrect password"})
		return
	}

	// Set a session token in the cookie after login
	token, _ := utils.GenerateJWT(project.ID)
	c.SetCookie("session_token", token, 86400, "/", "", false, true)
	c.JSON(http.StatusOK, gin.H{"message": "Access granted"})
}
