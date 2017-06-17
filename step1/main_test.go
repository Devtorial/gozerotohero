package main

import (
	"bytes"
	"io/ioutil"
	"math/rand"
	"net/http"
	"testing"
	"time"
)

func init() {
	client = &fakeGetter{}
}

func TestGetRandomUserData(t *testing.T) {
	t.Log(getRandomUserData())
}

func TestCreatePostAndComments(t *testing.T) {
	rand.Seed(1) // this will make it so the "random" values are the same every run
	users, _ := getRandomUserData()
	post := createPostAndComments(users, time.Now())
	if post.ImageURLSuffix != "men/13.jpg" || post.Name != "Raul Wade" || post.PostDate != time.Now().Add(-170*time.Minute) || len(post.Comments) != 2 {
		t.Error("expected values not returned", post.ImageURLSuffix, post.Name, post.PostDate, len(post.Comments))
	}

	rand.Seed(96) // try a different random seed to get different results
	post = createPostAndComments(users, time.Now())
	if post.ImageURLSuffix != "women/91.jpg" || post.Name != "Avery Miller" || post.PostDate != time.Now().Add(-90*time.Minute) || len(post.Comments) != 3 ||
		len(post.Comments[0].Comments) != 1 {
		t.Error("expected values not returned", post.ImageURLSuffix, post.Name, post.PostDate, len(post.Comments))
	}
}

/***************** Mocks and Mock Data *********************/
type fakeGetter struct{}

func (g *fakeGetter) Get(url string) (*http.Response, error) {
	return &http.Response{Body: ioutil.NopCloser(bytes.NewBufferString(results))}, nil
}

const results = `{
	"results": [{
		"name": {
			"first": "ana",
			"last": "jennings"
		},
		"picture": {
			"thumbnail": "https://randomuser.me/api/portraits/thumb/women/16.jpg"
		}
	},
	{
		"name": {
			"first": "zachary",
			"last": "fortin"
		},
		"picture": {
			"thumbnail": "https://randomuser.me/api/portraits/thumb/men/33.jpg"
		}
	},
	{
		"name": {
			"first": "ross",
			"last": "myers"
		},
		"picture": {
			"thumbnail": "https://randomuser.me/api/portraits/thumb/men/45.jpg"
		}
	},
	{
		"name": {
			"first": "olive",
			"last": "lee"
		},
		"picture": {
			"thumbnail": "https://randomuser.me/api/portraits/thumb/women/85.jpg"
		}
	},
	{
		"name": {
			"first": "matias",
			"last": "wuori"
		},
		"picture": {
			"thumbnail": "https://randomuser.me/api/portraits/thumb/men/72.jpg"
		}
	},
	{
		"name": {
			"first": "maya",
			"last": "simon"
		},
		"picture": {
			"thumbnail": "https://randomuser.me/api/portraits/thumb/women/8.jpg"
		}
	},
	{
		"name": {
			"first": "iracema",
			"last": "freitas"
		},
		"picture": {
			"thumbnail": "https://randomuser.me/api/portraits/thumb/women/23.jpg"
		}
	},
	{
		"name": {
			"first": "terrance",
			"last": "roberts"
		},
		"picture": {
			"thumbnail": "https://randomuser.me/api/portraits/thumb/men/34.jpg"
		}
	},
	{
		"name": {
			"first": "caroline",
			"last": "kristensen"
		},
		"picture": {
			"thumbnail": "https://randomuser.me/api/portraits/thumb/women/24.jpg"
		}
	},
	{
		"name": {
			"first": "avery",
			"last": "miller"
		},
		"picture": {
			"thumbnail": "https://randomuser.me/api/portraits/thumb/women/91.jpg"
		}
	},
	{
		"name": {
			"first": "elsa",
			"last": "dubois"
		},
		"picture": {
			"thumbnail": "https://randomuser.me/api/portraits/thumb/women/61.jpg"
		}
	},
	{
		"name": {
			"first": "johnni",
			"last": "bryant"
		},
		"picture": {
			"thumbnail": "https://randomuser.me/api/portraits/thumb/men/81.jpg"
		}
	},
	{
		"name": {
			"first": "vedat",
			"last": "eliçin"
		},
		"picture": {
			"thumbnail": "https://randomuser.me/api/portraits/thumb/men/43.jpg"
		}
	},
	{
		"name": {
			"first": "juno",
			"last": "stassen"
		},
		"picture": {
			"thumbnail": "https://randomuser.me/api/portraits/thumb/men/26.jpg"
		}
	},
	{
		"name": {
			"first": "nour-eddine",
			"last": "rademakers"
		},
		"picture": {
			"thumbnail": "https://randomuser.me/api/portraits/thumb/men/99.jpg"
		}
	},
	{
		"name": {
			"first": "abigail",
			"last": "hall"
		},
		"picture": {
			"thumbnail": "https://randomuser.me/api/portraits/thumb/women/21.jpg"
		}
	},
	{
		"name": {
			"first": "solène",
			"last": "renard"
		},
		"picture": {
			"thumbnail": "https://randomuser.me/api/portraits/thumb/women/71.jpg"
		}
	},
	{
		"name": {
			"first": "raul",
			"last": "wade"
		},
		"picture": {
			"thumbnail": "https://randomuser.me/api/portraits/thumb/men/13.jpg"
		}
	},
	{
		"name": {
			"first": "coşkun",
			"last": "keçeci"
		},
		"picture": {
			"thumbnail": "https://randomuser.me/api/portraits/thumb/men/75.jpg"
		}
	},
	{
		"name": {
			"first": "aitor",
			"last": "hernandez"
		},
		"picture": {
			"thumbnail": "https://randomuser.me/api/portraits/thumb/men/20.jpg"
		}
	},
	{
		"name": {
			"first": "glen",
			"last": "george"
		},
		"picture": {
			"thumbnail": "https://randomuser.me/api/portraits/thumb/men/17.jpg"
		}
	},
	{
		"name": {
			"first": "luke",
			"last": "long"
		},
		"picture": {
			"thumbnail": "https://randomuser.me/api/portraits/thumb/men/48.jpg"
		}
	},
	{
		"name": {
			"first": "evandra",
			"last": "oliveira"
		},
		"picture": {
			"thumbnail": "https://randomuser.me/api/portraits/thumb/women/20.jpg"
		}
	},
	{
		"name": {
			"first": "carter",
			"last": "ambrose"
		},
		"picture": {
			"thumbnail": "https://randomuser.me/api/portraits/thumb/men/22.jpg"
		}
	},
	{
		"name": {
			"first": "patricia",
			"last": "moreno"
		},
		"picture": {
			"thumbnail": "https://randomuser.me/api/portraits/thumb/women/3.jpg"
		}
	}],
	"info": {
		"seed": "dcbdc15b07f4d9f8",
		"results": 25,
		"page": 1,
		"version": "1.1"
	}
}`
