package db

import (
	"fmt"

	"github.com/Chufretalas/aux_scriptum/models"
)

func GetAllDiaryEntries() ([]models.DiaryEntry, error) {
	selectAllDiaryEntries, err := DB.Query("SELECT id, day, title, content FROM diary_entries")
	if err != nil {
		return nil, fmt.Errorf("failed while getting all diary entries: %w", err)
	}
	defer selectAllDiaryEntries.Close()

	diaryEntries := make([]models.DiaryEntry, 0)

	for selectAllDiaryEntries.Next() {
		var dE models.DiaryEntry
		err := selectAllDiaryEntries.Scan(&dE.Id, &dE.Day, &dE.Title, &dE.Content)
		if err != nil {
			return nil, fmt.Errorf("failed while parsing all diary entries: %w", err)
		}
		diaryEntries = append(diaryEntries, dE)
	}

	return diaryEntries, nil
}
