package server

import (
	"app/internal/agentAI"
	"app/internal/models"
	"net/http"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func RunServer() {
	var server = gin.Default()

	// CORS config
	server.Use(cors.New(
		cors.Config{
			AllowOrigins:     []string{"*"},
			AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
			AllowHeaders:     []string{"Content-Type", "Authorization"},
			ExposeHeaders:    []string{"Content-Length"},
			AllowCredentials: false,
			MaxAge:           12 * time.Hour,
		},
	))

	// End Points
	_RoutesApplication(server)

	server.Run(":8000")
}

func _RoutesApplication(server *gin.Engine) {
	server.GET("/getPhrase", func(ctx *gin.Context) {
		result, err := agentAI.GeneratePhrase()
		if err != nil {
			ctx.JSON(http.StatusInternalServerError,
				struct {
					Message models.ModelPhrase
					Err     error
				}{Message: result, Err: err},
			)
			return
		}
		ctx.JSON(200, result)
	})
	server.GET("/useDictionary/:word", func(ctx *gin.Context) {
		word := ctx.Param("word")
		result, err := agentAI.UseDictionary(word)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError,
				struct {
					Message models.DictionaryEntry
					Err     error
				}{Message: result, Err: err},
			)
			return
		}
		ctx.JSON(200, result)
	})
}
