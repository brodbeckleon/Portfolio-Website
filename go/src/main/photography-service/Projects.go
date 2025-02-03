package photography_service

type Project struct {
	ID        uint   `gorm:"primaryKey"`
	ProjectID string `gorm:"uniqueIndex"`
	Password  string // hashed with bcrypt
}
