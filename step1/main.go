package main

import (
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"strings"
	"time"

	"github.com/drhodes/golorem"
	"github.com/julienschmidt/httprouter"
)

var client httpGetter = http.DefaultClient

type randomUserData struct {
	Results []person
}

type person struct {
	Name    name
	Picture picture
}

type name struct {
	First string
	Last  string
}

type picture struct {
	Thumbnail string
}

type feedData struct {
	UserID         int
	Name           string
	ImageURLSuffix string
	Post           string
	PostDate       string
	Comments       []feedData
}

type httpGetter interface {
	Get(string) (*http.Response, error)
}

func main() {
	users, err := getRandomUserData()
	if err != nil {
		log.Fatal(err)
	}

	router := httprouter.New()
	router.GET("/api/feed/:page", getFeed(users))
	router.NotFound = http.FileServer(http.Dir("../client")) // html client
	log.Fatal(http.ListenAndServe(":1234", router))
}

func getRandomUserData() ([]person, error) {
	r, err := client.Get("https://randomuser.me/api/?results=200&inc=name,picture")
	if err != nil {
		return nil, err
	}

	data := randomUserData{}
	d := json.NewDecoder(r.Body)
	if err := d.Decode(&data); err != nil {
		return nil, err
	}
	return data.Results, nil
}

func getFeed(people []person) func(http.ResponseWriter, *http.Request, httprouter.Params) {
	return func(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
		feed := make([]feedData, 10)
		for i := 0; i < 10; i++ {
			feed[i] = *createPostAndComments(people, time.Now())
		}

		jsonText, err := json.Marshal(feed)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		fmt.Fprint(w, string(jsonText))
	}
}

func createPostAndComments(people []person, timeAfter time.Time) *feedData {
	userID, person, postDate := getRandomPersonAndDate(people, timeAfter)
	post := createPost(userID, person, postDate, 20)

	numComments := rand.Intn(5)
	comments := make([]feedData, numComments)
	for i := 0; i < numComments; i++ {
		userID, person, postDate = getRandomPersonAndDate(people, postDate)
		comments[i] = *createPost(userID, person, postDate, 3)
		if rand.Intn(3) == 0 { // 1 in 4 chance that there will be a reply
			numReplies := rand.Intn(2) // up to two replies
			replies := make([]feedData, numReplies)
			for j := 0; j < numReplies; j++ {
				userID, person, postDate = getRandomPersonAndDate(people, postDate)
				replies[j] = *createPost(userID, person, postDate, 1)
			}
			comments[i].Comments = replies
		}
	}
	post.Comments = comments
	return post
}

func createPost(userID int, person *person, postDate time.Time, maxLength int) *feedData {
	dateString := postDate.Format("Jan 2 at 3:04pm")
	timeSince := time.Now().Sub(postDate)
	imageURLSuffix := strings.SplitAfter(person.Picture.Thumbnail, "thumb/")[1]
	if timeSince < 24*time.Hour {
		dateString = fmt.Sprintf("%.0f hrs", timeSince.Hours())
	}
	return &feedData{
		UserID:         userID,
		Name:           strings.Title(person.Name.First) + " " + strings.Title(person.Name.Last),
		ImageURLSuffix: imageURLSuffix,
		Post:           lorem.Paragraph(1, maxLength),
		PostDate:       dateString,
	}
}

func getRandomPersonAndDate(people []person, timeAfter time.Time) (int, *person, time.Time) {
	i := rand.Intn(24) // pick random person from list of 24. Also used for time
	return i, &people[i], timeAfter.Add(-time.Duration(i) * 10 * time.Minute)
}
