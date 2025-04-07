package db

import (
	"fmt"
	"os"
)

func ExecuteSQLFile(filePath string) error {
	sqlBytes, err := os.ReadFile(filePath)
	if err != nil {
		return fmt.Errorf("failed to read SQL file: %w", err)
	}

	_, err = DB.Exec(string(sqlBytes))
	if err != nil {
		return fmt.Errorf("failed to execute SQL: %w", err)
	}

	return nil
}
