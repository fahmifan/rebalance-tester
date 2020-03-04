package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/go-chi/chi"
	log "github.com/sirupsen/logrus"
)

func main() {
	fmt.Println("hello rebalance tester")
	r := chi.NewRouter()
	serveWWW(r, "/")

	rebalanceURL := "http://localhost:9000"
	if val, ok := os.LookupEnv("PROXY_URL"); ok {
		rebalanceURL = val
	}

	s := service{
		rebalanceURL: rebalanceURL,
	}
	r.Get("/api/sorts", s.handleSorts)
	port := ":3000"

	log.Infof("start server at %s", port)
	log.Fatal(http.ListenAndServe(port, r))
}

type service struct {
	rebalanceURL string
}

func serveWWW(r chi.Router, path string) {
	workDir, _ := os.Getwd()
	filesDir := filepath.Join(workDir, "www")

	root := http.Dir(filesDir)
	if strings.ContainsAny(path, "{}*") {
		panic("FileServer does not permit URL parameters.")
	}

	fs := http.StripPrefix(path, http.FileServer(root))

	if path != "/" && path[len(path)-1] != '/' {
		r.Get(path, http.RedirectHandler(path+"/", 301).ServeHTTP)
		path += "/"
	}
	path += "*"

	r.Get(path, http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fs.ServeHTTP(w, r)
	}))
}

func (s *service) handleSorts(w http.ResponseWriter, r *http.Request) {
	resp, err := http.Get(s.rebalanceURL + "/api/sorts")
	if err != nil {
		log.Error(err)
		writeError(w, http.StatusInternalServerError, []byte(err.Error()))
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		writeError(w, resp.StatusCode, []byte("request failed"))
		return
	}

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Error(err)
		writeError(w, resp.StatusCode, []byte(err.Error()))
		return
	}

	writeJSONOK(w, map[string]interface{}{"message": string(body)})
}

func writeError(w http.ResponseWriter, statusCode int, msg []byte) {
	w.WriteHeader(statusCode)
	w.Write(msg)
}

func writeJSONOK(w http.ResponseWriter, res map[string]interface{}) {
	w.WriteHeader(http.StatusOK)

	j, err := json.Marshal(res)
	if err != nil {
		log.Error(err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}

	w.Write(j)
}
