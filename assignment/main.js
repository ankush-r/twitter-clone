let isLiked = false;
let likesCount = 0;

const storedUserDetailsJSON = sessionStorage.getItem('loggedInUser');
const storedUserDetails = JSON.parse(storedUserDetailsJSON);
const user = storedUserDetails.userDetails;
const userName = user.user_name;
const profilePicUrl = user.profile_url;

console.log(userName+ profilePicUrl);

function updateUserName(){
  document.getElementById('changeUsername').innerText = userName;
  document.getElementById('changeUser').innerText = userName;
  document.getElementById('profilePic').src = profilePicUrl;
  document.getElementById('postpic').src = profilePicUrl;
}

updateUserName();

function toggleLike(button) {
  isLiked = !isLiked;

  const imgElement = button.querySelector('img');

  if (isLiked) {
    imgElement.src = 'post-elements/liked.png'; // Change to the path of your liked image
    likesCount++;
  } else {
    imgElement.src = 'post-elements/like.png'; // Change to the path of your default like image
    likesCount--;
  }

  updateLikesCount(button.parentElement);
}

function updateLikesCount(button) {
  const likesCountElement = button.querySelector('.likes-count');
  likesCountElement.textContent = likesCount;
  if (isLiked){
    likesCountElement.style.color = 'red';
  }else{
    likesCountElement.style.color = 'white';
  }
}

function handleTextareaInput() {
  const tweetInput = document.querySelector('.post-input').value;
  const postButton = document.querySelector('.tweet-btn');

  postButton.disabled = tweetInput.trim() === '';
}

function bringTweet() {
  const myDivision = document.getElementById('tweeter'); // Fix the method name
  console.log('clicked');
  toggleMobileButtons();
  hidePosts();
  const toggler = document.getElementById('post-invoker');
  toggler.style.display ='none';
  myDivision.style.display = 'block';

  const postbutton = document.getElementsByClassName('post-button');
  postbutton[0].style.display='none';

}

function toggleMobileButtons() {
  const mobileButtons = document.querySelector('.mobile-buttons');
  console.log('clicked');
  mobileButtons.style.display = 'flex';
}

function hidePosts(){
  const mobileButtons = document.querySelector('.posts');
  console.log('clicked');
  mobileButtons.style.display = 'none';
}

function goBackFunction(){
  const myDivision = document.getElementById('tweeter'); // Fix the method name
  console.log('clicked');
  myDivision.style.display = 'none';

  const mobileButtons = document.querySelector('.mobile-buttons');
  console.log('clicked');
  mobileButtons.style.display = 'none';

  const hider = document.querySelector('.posts');
  console.log('clicked');
  hider.style.display = 'flex';
  const toggler = document.getElementById('post-invoker');
  toggler.style.display ='block';
}

function loadnavbar(){
  const myDivision = document.getElementById('nav-mob'); // Fix the method name
  console.log('clicked');
  myDivision.style.display = 'flex'; 

  const hider = document.querySelector('.content-posts');
  console.log('clicked');
  hider.style.display = 'none';

  const toggler = document.getElementById('post-invoker');
  toggler.style.display ='none';
}

function bringAll(){
  const myDivision = document.getElementById('nav-mob'); // Fix the method name
  console.log('clicked');
  myDivision.style.display = 'none'; 

  const hider = document.querySelector('.content-posts');
  console.log('clicked');
  hider.style.display = 'flex';

  const toggler = document.getElementById('post-invoker');
  toggler.style.display ='block';
}

function previewImage(event){
  const imagePreview = document.getElementById('image-preview');
  imagePreview.src = URL.createObjectURL(event.target.files[0]);

}
async function posttweet(){
  const tweetInput = document.querySelector('.post-input').value;

  const imageElement = document.getElementById("image-preview")?.src;
  let show='block';
  if(imageElement == ''){
    show='none';
  }

  if (tweetInput.trim() === '') {
    alert('Please enter a tweet!');
    return;
  }
  const creator = userName;
  const creatorProfile = profilePicUrl;

  await sendPostToApi({ content: tweetInput, creator,creatorProfile});

  const postList = document.querySelector('.post-list');

  // Create a new li element with the necessary HTML structure
  const newTweet = document.createElement('li');
  newTweet.classList.add('post-item');
  newTweet.dataset.postId = generatePostId(); // Set a unique post ID

  newTweet.innerHTML = `
    <div class="profile__pic-post">
        <img src="${profilePicUrl}" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover;">
    </div>

    <div class="post-content">

        <div class="post-written">
            <div class="writer-title">
                <span class="account-name">${userName}</span>
                <span class="user-name">@${userName} - 1s</span>
            </div>
            <div class="actual-content">
                ${tweetInput}
                <img src=${imageElement} width="200px" display=${show}>
            </div>
        </div>

        <div class="buttons-react">
            <button class="comment"><img src="post-elements/comments.png"></button>
            <button class="retweet"><img src="post-elements/retweet.png"> </button>
            <div class="post-container">
                <button class="like-post" onclick="toggleLike(this)">
                  <img src="post-elements/like.png" alt="Like">
                </button>
                <span class="likes-count" style="font-size: 20px;">0</span>
              </div>
            <button class="stats"><img src="post-elements/stats.png"></button>
            <button class="save"><img src="post-elements/save.png"></button>
        </div>
    </div>

    <div class="third-column">
        <div class="options">
            <img src="post-elements/options.png">
        </div>

        <div class="upload">
            <img src="post-elements/upload.png">
        </div>
    </div>
  `;

  // Append the new tweet to the post list
  postList.insertBefore(newTweet, postList.firstChild);
  document.querySelector('.post-input').value = '';
  const imageTweet = document.getElementById('image-preview');
  imageTweet.src = '';


}

function generatePostId() {
  // Simple function to generate a unique post ID (replace with your own logic if needed)
  return Math.floor(Math.random() * 1000);
}

async function sendPostToApi(postData) {
  try {
    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    });

    if (response.ok) {
      return true;
    } else {
      const errorData = await response.json();
      alert(`API Error: ${errorData.error}`);
      return false;
    }
  } catch (error) {
    console.error('Error posting tweet to API:', error);
    return false;
  }
}


let pageNumber = 1;
const pageSize = 5;

async function fetchPosts() {
  
  try {
    const response = await fetch(`http://localhost:3500/api/posts?pageNumber=${pageNumber}&pageSize=${pageSize}`);
    if (response.ok) {
      const posts = await response.json();
      console.log('Fetched posts:', posts);
      return posts;
    } else {
      console.error('Error fetching posts:', response.status);
      return [];
    }
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}


function isScrolledToBottom() {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const windowHeight = window.innerHeight;
  const documentHeight = Math.max(
    document.body.scrollHeight, document.documentElement.scrollHeight,
    document.body.offsetHeight, document.documentElement.offsetHeight,
    document.body.clientHeight, document.documentElement.clientHeight
  );

  return scrollTop + windowHeight >= documentHeight - 100;
}


window.addEventListener('scroll', async () => {
  if (isScrolledToBottom()) {
    pageNumber++;
    const newPosts = await fetchPosts();
    newPosts.forEach((post) => {
      postTheTweet(post);
    });
  }
});

window.addEventListener('load', async () => {
  const initialPosts = await fetchPosts();
  initialPosts.forEach((post) => {
    postTheTweet(post);
  });
});

async function postTheTweet(post){

  const creator = post.creator;
  const tweetInput = post.content;
  const imageCreator = post.creatorProfile;

  const postList = document.querySelector('.post-list');

  // Create a new li element with the necessary HTML structure
  const newTweet = document.createElement('li');
  newTweet.classList.add('post-item');
  newTweet.dataset.postId = generatePostId(); // Set a unique post ID

  newTweet.innerHTML = `
    <div class="profile__pic-post">
        <img src="${imageCreator}" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover;">
    </div>

    <div class="post-content">

        <div class="post-written">
            <div class="writer-title">
                <span class="account-name">${creator}</span>
                <span class="user-name">@${creator} - 1s</span>
            </div>
            <div class="actual-content">
                ${tweetInput}
            </div>
        </div>

        <div class="buttons-react">
            <button class="comment"><img src="post-elements/comments.png"></button>
            <button class="retweet"><img src="post-elements/retweet.png"> </button>
            <div class="post-container">
                <button class="like-post" onclick="toggleLike(this)">
                  <img src="post-elements/like.png" alt="Like">
                </button>
                <span class="likes-count" style="font-size: 20px;">0</span>
              </div>
            <button class="stats"><img src="post-elements/stats.png"></button>
            <button class="save"><img src="post-elements/save.png"></button>
        </div>
    </div>

    <div class="third-column">
        <div class="options">
            <img src="post-elements/options.png">
        </div>

        <div class="upload">
            <img src="post-elements/upload.png">
        </div>
    </div>
  `;

  // Append the new tweet to the post list
  // postList.insertBefore(newTweet, postList.firstChild);
  postList.appendChild(newTweet);
  document.querySelector('.post-input').value = '';


}

