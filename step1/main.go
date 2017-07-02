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
	UserID  int
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
	PostID       int
	UserID       int
	Name         string
	ProfileImage string
	SharedImage  string
	SharedVideo  string
	Post         string
	PostDate     time.Time
	Comments     []feedData
}

type trending struct {
	News          []article
	Politics      []article
	Tech          []article
	Sports        []article
	Entertainment []article
}
type article struct {
	Title       string
	Description string
	Url         string
	PublishedAt string
}

type httpGetter interface {
	Get(string) (*http.Response, error)
}

func main() {
	// make API calls to get random data I need only once on startup rather than
	// on each page view to ease burden on API server since this is only for testing
	users, trending := getAPIData()

	router := httprouter.New()
	router.GET("/api/feed/:page", getFeed(users))
	router.GET("/api/users/me", getLoggedInUser(users))
	router.GET("/api/pages", getPages(users))
	router.GET("/api/events", getEvents)
	router.GET("/api/trending", getTrending(trending))
	router.GET("/api/ads", getAds)
	router.GET("/api/shortcuts", getShortcuts)
	router.GET("/api/explores", getExplores)
	router.NotFound = http.FileServer(http.Dir("../client")) // html client
	log.Fatal(http.ListenAndServe(":1234", router))
}

func getAPIData() ([]person, *trending) {
	users, _ := getRandomUserData()
	trending := trending{}
	trending.News, _ = getNews("the-new-york-times", "top")
	trending.Politics, _ = getNews("cnn", "top")
	trending.Tech, _ = getNews("techcrunch", "top")
	trending.Sports, _ = getNews("espn", "top")
	trending.Entertainment, _ = getNews("entertainment-weekly", "top")
	return users, &trending
}

func outputMessage(w http.ResponseWriter, message string, err error) {
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Add("Access-Control-Allow-Origin", "*")
	w.Header().Add("Content-Type", "application/json")
	fmt.Fprint(w, message)
}

// For the purpose of this demo, we'll just create random data.
// Normally this data would be coming from a database
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
	for i := 0; i < len(data.Results); i++ { // save UserID as the index in the array
		data.Results[i].Name.First = strings.Title(data.Results[i].Name.First)
		data.Results[i].Name.Last = strings.Title(data.Results[i].Name.Last)
		data.Results[i].UserID = i
	}
	return data.Results, nil
}

func getLoggedInUser(people []person) func(http.ResponseWriter, *http.Request, httprouter.Params) {
	return func(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
		person := people[rand.Intn(len(people)-1)]
		json, err := json.Marshal(person)
		outputMessage(w, string(json), err)
	}
}

func getFeed(people []person) func(http.ResponseWriter, *http.Request, httprouter.Params) {
	return func(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
		feed := createMultiplePosts(people, time.Now(), 10)
		jsonText, err := json.Marshal(feed)
		outputMessage(w, string(jsonText), err)
	}
}

func getPages(people []person) func(http.ResponseWriter, *http.Request, httprouter.Params) {
	return func(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
		posts := createMultiplePosts(people, time.Now(), 3)
		pages := []struct {
			Name            string
			ProfileImage    string
			Likes           int
			LikesThisWeek   int
			Views           int
			PostEngagements int
			PostComments    int
			PostShares      int
			AdTitle         string
			AdText          string
			AdImageURL      string
			AdButtonText    string
			RecentPosts     []feedData
		}{
			{Name: "EndFirst", ProfileImage: "endfirst.png", Likes: 93, LikesThisWeek: 0, Views: 14, PostEngagements: 16, PostComments: 0, PostShares: 0, AdTitle: "Promote Your Post", AdText: `Your post "As you may know, our Kickstart..." is getting more engagement than 95% of your recent posts. Boost it to reach up to 6,800 more people in Oregon.`, RecentPosts: posts},
		}

		jsonText, err := json.Marshal(pages)
		outputMessage(w, string(jsonText), err)
	}
}

func getEvents(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	jsonText, err := json.Marshal(events)
	outputMessage(w, string(jsonText), err)
}

// using the API key from https://www.quora.com/Are-there-any-APIs-for-news-headlines which was provided by the newsapi.org website
func getNews(source, sortby string) ([]article, error) {
	url := fmt.Sprintf("https://newsapi.org/v1/articles?apikey=3e22f2fcc1344975ae2b2e69379e2a6e&sortBy=%s&source=%s", sortby, source)
	r, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	data := struct {
		Articles []article
	}{}
	u := json.NewDecoder(r.Body)
	err = u.Decode(&data)
	if err != nil {
		return nil, err
	}
	return data.Articles, nil
}

func getTrending(trending *trending) func(http.ResponseWriter, *http.Request, httprouter.Params) {
	return func(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
		jsonText, err := json.Marshal(trending)
		outputMessage(w, string(jsonText), err)
	}
}

func getAds(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	jsonText, err := json.Marshal(ads)
	outputMessage(w, string(jsonText), err)
}

func getShortcuts(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	jsonText, err := json.Marshal(shortcuts)
	outputMessage(w, string(jsonText), err)
}

func getExplores(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	jsonText, err := json.Marshal(explores)
	outputMessage(w, string(jsonText), err)
}

func createMultiplePosts(people []person, timeAfter time.Time, numPosts int) []feedData {
	feed := make([]feedData, numPosts)
	for i := 0; i < numPosts; i++ {
		feed[i] = *createPostAndComments(people, timeAfter)
	}
	return feed
}

func createPostAndComments(people []person, timeAfter time.Time) *feedData {
	person, postDate := getRandomPersonAndDate(people, timeAfter)
	post := createPost(person, postDate, 20)
	randomlyAddImageOrVideo(post)

	numComments := rand.Intn(5)
	comments := make([]feedData, numComments)
	for i := 0; i < numComments; i++ {
		person, postDate = getRandomPersonAndDate(people, postDate)
		comments[i] = *createPost(person, postDate, 3)
		if rand.Intn(3) == 0 { // 1 in 4 chance that there will be a reply
			numReplies := rand.Intn(2) // up to two replies
			replies := make([]feedData, numReplies)
			for j := 0; j < numReplies; j++ {
				person, postDate = getRandomPersonAndDate(people, postDate)
				replies[j] = *createPost(person, postDate, 1)
			}
			comments[i].Comments = replies
		}
	}
	post.Comments = comments
	return post
}

func randomlyAddImageOrVideo(post *feedData) {
	if chance := rand.Intn(3); chance == 0 { // video
		post.SharedVideo = randomVideos[rand.Intn(len(randomVideos)-1)]
	} else if chance == 1 { // image
		post.SharedImage = randomImages[rand.Intn(len(randomImages)-1)]
	}
}

func createPost(person *person, postDate time.Time, maxLength int) *feedData {
	profileImage := strings.SplitAfter(person.Picture.Thumbnail, "thumb/")[1]
	return &feedData{
		UserID:       person.UserID,
		Name:         person.Name.First + " " + person.Name.Last,
		ProfileImage: profileImage,
		Post:         lorem.Paragraph(1, maxLength),
		PostDate:     postDate,
	}
}

func getRandomPersonAndDate(people []person, timeAfter time.Time) (*person, time.Time) {
	i := rand.Intn(len(people) - 1) // pick random person from list. Also used for time
	return &people[i], timeAfter.Add(-time.Duration(i) * time.Minute)
}

var shortcuts = []struct {
	Name     string
	URL      string
	ImageURL string
}{
	{Name: "Ensign Symphony & Chorus", ImageURL: ""},
	{Name: "EndFirst", ImageURL: ""},
	{Name: "Devtorial", ImageURL: ""},
	{Name: "Lindsey Stirling", ImageURL: ""},
	{Name: "The Piano Guys", ImageURL: ""},
	{Name: "Jennifer Thomas", ImageURL: ""},
}

var explores = []struct {
	Name string
	URL  string
	Icon string
}{
	{Name: "Pages", Icon: "fa-file-text-o"},
	{Name: "Groups", Icon: "fa-users"},
	{Name: "Events", Icon: "fa-calendar"},
	{Name: "Friend Lists", Icon: "fa-user-plus"},
	{Name: "Manage Apps", Icon: "fa-wrench"},
	{Name: "On This Day", Icon: "fa-clock-o"},
	{Name: "Jobs", Icon: "fa-briefcase"},
	{Name: "Insights", Icon: "fa-search"},
	{Name: "Pages Feed", Icon: "fa-newspaper-o"},
	{Name: "Pokes", Icon: "fa-hand-o-right"},
	{Name: "Photos", Icon: "fa-picture-o"},
	{Name: "Offers", Icon: "fa-handshake-o"},
	{Name: "Ads Manager", Icon: "fa-signal"},
	{Name: "Games", Icon: "fa-gamepad"},
	{Name: "Suggest Edits", Icon: "fa-pencil-square-o"},
	{Name: "Live Video", Icon: "fa-video-camera"},
	{Name: "Marketplace", Icon: "fa-shopping-basket"},
	{Name: "Fundraisers", Icon: "fa-money"},
	{Name: "Moments", Icon: "fa-hourglass-1"},
	{Name: "Payment History", Icon: "fa-credit-card"},
	{Name: "Games Feed", Icon: "fa-trophy"},
	{Name: "Create a Frame", Icon: "fa-paint-brush"},
	{Name: "Town Hall", Icon: "fa-university"},
	{Name: "Order Food", Icon: "fa-cutlery"},
	{Name: "Saved", Icon: "fa-bookmark"},
	{Name: "Buy and Sell Groups", Icon: "fa-tags"},
	{Name: "Weather", Icon: "fa-sun-o"},
}

var ads = []struct {
	ImageURL string
	LinkURL  string
	Title    string
	Website  string
	Text     string
}{
	{ImageURL: "endfirst.png", LinkURL: "https://www.facebook.com/endfirstcorp/", Title: "Get EndFirst today", Website: "endfirst.com", Text: "Accelerate Business Communication with EndFirst"},
}

var events = []struct {
	Title     string
	StartTime time.Time
	Location  string
	ImageURL  string
}{
	{Title: "The American Dream", StartTime: time.Date(2017, 7, 8, 19, 30, 0, 0, time.Local), Location: "Benaroya Hall", ImageURL: ""},
}

var randomVideos = []string{"https://www.youtube.com/embed/njBGubkF5WA",
	"https://www.youtube.com/embed/dXKkrJkv1ew",
	"https://www.youtube.com/embed/16fDTTiV_Gk",
	"https://www.youtube.com/embed/GgV3d1HqQu8",
	"https://www.youtube.com/embed/pWZQp02epUg",
	"https://www.youtube.com/embed/k5vWeMvErHE",
	"https://www.youtube.com/embed/rOr38bGCZto",
	"https://www.youtube.com/embed/0tMJPTQ7R0Y",
	"https://www.youtube.com/embed/O3cBZ5X-eGw",
	"https://www.youtube.com/embed/mOO5qRjVFLw",
	"https://www.youtube.com/embed/u2Yk1CEgc4g",
	"https://www.youtube.com/embed/WZjFMj7OHTw",
	"https://www.youtube.com/embed/QgaTQ5-XfMM",
	"https://www.youtube.com/embed/6Dakd7EIgBE",
	"https://www.youtube.com/embed/RZQNe8IMLtQ",
	"https://www.youtube.com/embed/yET4p-r2TI8",
	"https://www.youtube.com/embed/jzF_y039slk",
	"https://www.youtube.com/embed/0VqTwnAuHws",
	"https://www.youtube.com/embed/Cgovv8jWETM",
	"https://www.youtube.com/embed/fz4MzJTeL0c",
	"https://www.youtube.com/embed/4MCjU-Du3eI",
	"https://www.youtube.com/embed/QAD0BtEv6-Q",
	"https://www.youtube.com/embed/xwsYvBYZcx4",
	"https://www.youtube.com/embed/aE2GCa-_nyU",
	"https://www.youtube.com/embed/BSLPH9d-jsI",
	"https://www.youtube.com/embed/qDsfou6UfjU",
	"https://www.youtube.com/embed/0g9poWKKpbU",
	"https://www.youtube.com/embed/3ke-sS8dPKk",
	"https://www.youtube.com/embed/KtQb2axKpuw",
	"https://www.youtube.com/embed/X-AjhXhk19U",
	"https://www.youtube.com/embed/TCL94-MsxYc",
	"https://www.youtube.com/embed/-onQcF95pfs",
	"https://www.youtube.com/embed/b3KUyPKbR7Q",
	"https://www.youtube.com/embed/dQiNVk_u0po",
	"https://www.youtube.com/embed/dQiNVk_u0po",
	"https://www.youtube.com/embed/MOg8Cz9yfWg",
	"https://www.youtube.com/embed/1A3i0GATnRI"}

var randomImages = []string{"http://25.media.tumblr.com/tumblr_m6r2n61rDE1qzex9io1_1280.jpg",
	"http://24.media.tumblr.com/tumblr_m2qvf8y2H41rn1j59o1_1280.jpg",
	"http://24.media.tumblr.com/tumblr_m4pxccNFcf1r6jd7fo1_400.jpg",
	"http://24.media.tumblr.com/tumblr_m0xwwvn0l21ron8pyo1_1280.png",
	"http://25.media.tumblr.com/tumblr_m35yo1wgls1r73wdao1_250.gif",
	"http://25.media.tumblr.com/tumblr_m40ljr1h1t1qafc06o1_500.jpg",
	"http://25.media.tumblr.com/tumblr_lv84ztPLuM1r5eom7o1_500.jpg",
	"http://25.media.tumblr.com/tumblr_ln9r87IsVM1qbt33io1_1280.jpg",
	"http://25.media.tumblr.com/tumblr_lvs776idCI1ql3tbeo1_500.jpg",
	"http://25.media.tumblr.com/tumblr_lpqunuQR3L1qz5b0yo1_500.jpg",
	"http://25.media.tumblr.com/tumblr_kv57arbYTQ1qz6jrko1_1280.jpg",
	"http://24.media.tumblr.com/tumblr_koo5ptlGAt1qzex9io1_1280.jpg",
	"http://24.media.tumblr.com/tumblr_lp7i0cEv6o1qz5dg8o1_1280.jpg",
	"http://24.media.tumblr.com/tumblr_m3brsyyWwC1qa95ofo1_1280.png",
	"http://24.media.tumblr.com/pysAnwUDWi5cv6fhpzzD1fF3o1_400.gif",
	"http://24.media.tumblr.com/x3Rmp1Hjoomt4zbbLYoxA0XUo1_500.jpg",
	"http://24.media.tumblr.com/tumblr_m7ksigtM9M1qzapxqo1_1280.jpg",
	"http://24.media.tumblr.com/tumblr_lvvpdrQQ3o1qbd47zo1_500.jpg",
	"http://25.media.tumblr.com/tumblr_m2qorgX2Ly1r6b7kmo1_500.jpg"}
