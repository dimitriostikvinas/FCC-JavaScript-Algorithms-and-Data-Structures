/* 
    This snippet efficiently establishes references to crucial DOM elements that facilitate user interaction with the music player's interface. 
    Each variable is named to clearly correspond with its role within the application, 
    simplifying further scripting and event handling related to these elements.
*/
// Retrieve and store the container for the playlist's song entries for dynamic updates
const playlistSongs = document.getElementById("playlist-songs");

// Retrieve and store the play button for starting or resuming song playback
const playButton = document.getElementById("play");

// Retrieve and store the pause button for pausing the current song
const pauseButton = document.getElementById("pause");

// Retrieve and store the next button to skip to the next song in the playlist
const nextButton = document.getElementById("next");

// Retrieve and store the previous button to go back to the previous song or restart the current one
const previousButton = document.getElementById("previous");

// Retrieve and store the shuffle button to randomize the order of songs in the playlist
const shuffleButton = document.getElementById("shuffle");

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
const allSongs = [
    {
      id: 0,
      title: "Scratching The Surface",
      artist: "Quincy Larson",
      duration: "4:25",
      src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/scratching-the-surface.mp3",
    },
    {
      id: 1,
      title: "Can't Stay Down",
      artist: "Quincy Larson",
      duration: "4:15",
      src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/cant-stay-down.mp3",
    },
    {
      id: 2,
      title: "Still Learning",
      artist: "Quincy Larson",
      duration: "3:51",
      src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/still-learning.mp3",
    },
    {
      id: 3,
      title: "Cruising for a Musing",
      artist: "Quincy Larson",
      duration: "3:34",
      src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/cruising-for-a-musing.mp3",
    },
    {
      id: 4,
      title: "Never Not Favored",
      artist: "Quincy Larson",
      duration: "3:35",
      src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/never-not-favored.mp3",
    },
    {
      id: 5,
      title: "From the Ground Up",
      artist: "Quincy Larson",
      duration: "3:12",
      src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/from-the-ground-up.mp3",
    },
    {
      id: 6,
      title: "Walking on Air",
      artist: "Quincy Larson",
      duration: "3:25",
      src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/walking-on-air.mp3",
    },
    {
      id: 7,
      title: "Can't Stop Me. Can't Even Slow Me Down.",
      artist: "Quincy Larson",
      duration: "3:52",
      src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/cant-stop-me-cant-even-slow-me-down.mp3",
    },
    {
      id: 8,
      title: "The Surest Way Out is Through",
      artist: "Quincy Larson",
      duration: "3:10",
      src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/the-surest-way-out-is-through.mp3",
    },
    {
      id: 9,
      title: "Chasing That Feeling",
      artist: "Quincy Larson",
      duration: "2:43",
      src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/chasing-that-feeling.mp3",
    },
];

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
    The code snippet handles initializing an audio player and defines functions for playing and pausing songs. 
    It leverages the JavaScript Audio object for audio control, 
    and structures userData to maintain state related to song selection and playback progress. 
    The playSong function demonstrates complex logic to manage song changes and persist the playback position, 
    while pauseSong ensures that the current state is captured before pausing.
     The snippet also emphasizes accessibility and dynamic UI updates to reflect the current playback status and song details.
*/ 

// Creates a new Audio object to handle media playback.
const audio = new Audio();

// Initializes a userData object to store the playlist (copied from allSongs), the currently selected song, and playback time.
let userData = {
  songs: [...allSongs],    // Spread operator copies allSongs array into userData.songs.
  currentSong: null,      // No song is selected by default.
  songCurrentTime: 0,     // Current playback time is initialized to 0 seconds.
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////
// Defines a function to play a song identified by its 'id'.
const playSong = (id) => {
  // Finds the song in userData.songs where the song's id matches the provided id.
  const song = userData?.songs.find((song) => song.id === id);

  // Sets the audio source URL and title properties for the audio player.
  audio.src = song.src;
  audio.title = song.title;

  // Checks if the currently playing song is not set or different from the selected song.
  if (userData?.currentSong === null || userData?.currentSong.id !== song.id) {
    audio.currentTime = 0;  // Resets the playback position to the start if it's a new song.
  } else {
    // Continues from the last known playback position if the same song is reselected.
    audio.currentTime = userData?.songCurrentTime;
  }

  // Updates the currentSong in userData to the newly selected song.
  userData.currentSong = song;

  // Adds 'playing' class to playButton for visual feedback.
  playButton.classList.add("playing");

  // Function calls to update UI components related to the song playback.
  highlightCurrentSong();      // Highlights the current song in the playlist UI.
  setPlayerDisplay();          // Updates song title and artist on the player display.
  setPlayButtonAccessibleText(); // Ensures the play button has accessible text reflecting the current state.

  // Starts or resumes playing the audio.
  audio.play();
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Defines a function to pause the currently playing song.
const pauseSong = () => {
  // Saves the current playback time to userData.
  userData.songCurrentTime = audio.currentTime;

  // Removes 'playing' class from playButton to update its visual state.
  playButton.classList.remove("playing");

  // Pauses the audio playback.
  audio.pause();
};

//////////////////////////////////////////////////////////////////////////////////////////////////////
/*
    This function plays the next song in the playlist. If no song is currently active, 
    it starts from the first song. Otherwise, it finds the next song using the index of the currently playing song and plays it.
*/

const playNextSong = () => {
    // Check if a song is currently selected
    if (userData?.currentSong === null) {
      // No song is selected, so play the first song in the playlist
      playSong(userData?.songs[0].id);
    } else {
      // Retrieve the index of the current song
      const currentSongIndex = getCurrentSongIndex();
      // Get the next song in the playlist based on the current song's index
      const nextSong = userData?.songs[currentSongIndex + 1];
  
      // Play the next song
      playSong(nextSong.id);
    }
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
    This function is designed to play the previous song. If a song is currently active, 
    it computes the previous song based on the current song's index and plays it. 
    It exits without doing anything if no song is currently active.
*/

const playPreviousSong = () => {
    // Return if no song is currently playing
    if (userData?.currentSong === null) return;
    else {
        // Get the index of the current song
        const currentSongIndex = getCurrentSongIndex();
        // Calculate the previous song's index and retrieve it
        const previousSong = userData?.songs[currentSongIndex - 1];

        // Play the previous song
        playSong(previousSong.id);
    }
};

 //////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
    Shuffles the order of songs randomly and resets the current song state. It then updates the UI to reflect these changes.
*/

const shuffle = () => {
    // Randomly reorder the songs in the userData.songs array
    userData?.songs.sort(() => Math.random() - 0.5);
    // Reset the current song and playback time
    userData.currentSong = null;
    userData.songCurrentTime = 0;

    // Update the UI with the new song order and reset the playback state
    renderSongs(userData?.songs);
    pauseSong();
    setPlayerDisplay();
    setPlayButtonAccessibleText();
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
    Handles the deletion of a song from the playlist. If the song being deleted is currently playing, 
    it stops the playback and updates the UI. It also allows for resetting the playlist to its original state if all songs are deleted.
*/

const deleteSong = (id) => {
    // Check if the song to be deleted is currently playing
    if (userData?.currentSong?.id === id) {
      // Reset the current song and playback time if it is
      userData.currentSong = null;
      userData.songCurrentTime = 0;
  
      // Pause the song and update the display
      pauseSong();
      setPlayerDisplay();
    }
  
    // Remove the song from the list by filtering out the song with the given id
    userData.songs = userData?.songs.filter((song) => song.id !== id);
    // Update the playlist display
    renderSongs(userData?.songs); 
    highlightCurrentSong(); 
    setPlayButtonAccessibleText(); 
  
    // Add a reset button if no songs are left
    if (userData?.songs.length === 0) {
      const resetButton = document.createElement("button");
      const resetText = document.createTextNode("Reset Playlist");
  
      resetButton.id = "reset";
      resetButton.ariaLabel = "Reset playlist";
      resetButton.appendChild(resetText);
      playlistSongs.appendChild(resetButton);
  
      // Reset the playlist to the original songs list when the reset button is clicked
      resetButton.addEventListener("click", () => {
        userData.songs = [...allSongs];
  
        renderSongs(sortSongs()); 
        setPlayButtonAccessibleText();
        resetButton.remove();
      });
    }
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
    Updates the music player UI to display the title and artist of the currently playing song. 
    If no song is selected (e.g., playlist is empty), it clears the display.
*/

const setPlayerDisplay = () => {
    // Access the DOM to get elements where the song title and artist are displayed.
    const playingSong = document.getElementById("player-song-title");
    const songArtist = document.getElementById("player-song-artist");
  
    // Retrieve title and artist from the currently playing song in userData.
    const currentTitle = userData?.currentSong?.title;
    const currentArtist = userData?.currentSong?.artist;
  
    // Set the text content of the song title and artist elements.
    // If there's no current song, it sets the content to an empty string.
    playingSong.textContent = currentTitle ? currentTitle : "";
    songArtist.textContent = currentArtist ? currentArtist : "";
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
    Manages visual cues in the UI by highlighting the currently active song in the playlist. 
    This helps users see which song is currently playing.
*/

const highlightCurrentSong = () => {
    // Selects all song elements in the playlist to potentially remove highlighting.
    const playlistSongElements = document.querySelectorAll(".playlist-song");
  
    // Find the specific song element that matches the currently playing song.
    const songToHighlight = document.getElementById(`song-${userData?.currentSong?.id}`);
  
    // Remove the 'aria-current' attribute from all songs to clear previous highlights.
    playlistSongElements.forEach((songEl) => {
      songEl.removeAttribute("aria-current");
    });
  
    // Set 'aria-current' to 'true' on the currently playing song to highlight it.
    if (songToHighlight) songToHighlight.setAttribute("aria-current", "true");
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
   Dynamically generates and displays a list of songs in the playlist section of the application. 
   Each song has interactive elements for playback control and deletion, facilitating full management of the playlist through the UI. 
*/

const renderSongs = (array) => {
    // Maps each song in the provided array to an HTML list item.
    const songsHTML = array.map((song) => {
      return `
        <li id="song-${song.id}" class="playlist-song">
          <button class="playlist-song-info" onclick="playSong(${song.id})">
            <span class="playlist-song-title">${song.title}</span>
            <span class="playlist-song-artist">${song.artist}</span>
            <span class="playlist-song-duration">${song.duration}</span>
          </button>
          <button onclick="deleteSong(${song.id})" class="playlist-song-delete" aria-label="Delete ${song.title}">
            <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="8" fill="#4d4d62"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M5.32587 5.18571C5.7107 4.90301 6.28333 4.94814 6.60485 5.28651L8 6.75478L9.39515 5.28651C9.71667 4.94814 10.2893 4.90301 10.6741 5.18571C11.059 5.4684 11.1103 5.97188 10.7888 6.31026L9.1832 7.99999L10.7888 9.68974C11.1103 10.0281 11.059 10.5316 10.6741 10.8143C10.2893 11.097 9.71667 11.0519 9.39515 10.7135L8 9.24521L6.60485 10.7135C6.28333 11.0519 5.7107 11.097 5.32587 10.8143C4.94102 10.5316 4.88969 10.0281 5.21121 9.68974L6.8168 7.99999L5.21122 6.31026C4.8897 5.97188 4.94102 5.4684 5.32587 5.18571Z" fill="white"/>
            </svg>
          </button>
        </li>
      `;
    }).join(""); // Joins all HTML strings into one large HTML string without any separators.
  
    // Sets the innerHTML of the playlistSongs element to the newly created list of song items.
    playlistSongs.innerHTML = songsHTML;
};
  
///////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
    Enhances accessibility by providing descriptive labels for screen readers, 
    helping visually impaired users understand the function of the play button based on the song context.
*/ 

const setPlayButtonAccessibleText = () => {
    // Determines the current song or defaults to the first song if none is selected.
    const song = userData?.currentSong || userData?.songs[0];
  
    // Sets an accessible label for the play button that reflects the current or first song's title.
    playButton.setAttribute(
      "aria-label",
      song?.title ? `Play ${song.title}` : "Play"
    );
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
    Retrieves the index of the currently playing song within the playlist array. 
    This is useful for navigation controls like next and previous.
*/

const getCurrentSongIndex = () => userData?.songs.indexOf(userData?.currentSong);

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
    These listeners bind UI buttons to their respective functions, enabling user interaction with the music player. 
    Each listener calls the appropriate function when its corresponding button is 
    clicked, providing play, pause, next, previous, and shuffle functionalities.
*/

playButton.addEventListener("click", () => {
    if (userData?.currentSong === null) {
      playSong(userData?.songs[0].id);  // Start from the first song if none is currently selected.
    } else {
      playSong(userData?.currentSong.id);  // Continue playing the current song.
    }
  });
  
pauseButton.addEventListener("click", pauseSong);

nextButton.addEventListener("click", playNextSong);

previousButton.addEventListener("click", playPreviousSong);

shuffleButton.addEventListener("click", shuffle);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
  Handles automatic song transitions upon the current song's completion. 
  If there's a next song, it automatically plays it; otherwise, it resets the playback state and updates the UI accordingly.
*/

audio.addEventListener("ended", () => {
    const currentSongIndex = getCurrentSongIndex();
    const nextSongExists = userData?.songs[currentSongIndex + 1] !== undefined;
  
    if (nextSongExists) {
      playNextSong();  // Automatically start the next song if it exists.
    } else {
      // Reset playback state if the end of the playlist is reached.
      userData.currentSong = null;
      userData.songCurrentTime = 0;  
      pauseSong();
      setPlayerDisplay();
      highlightCurrentSong();
      setPlayButtonAccessibleText();
    }
});
 
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
     Alphabetically sorts the songs by title. This sorting logic is crucial for displaying the songs in a consistent, 
     ordered manner within the playlist.
*/ 
const sortSongs = () => {
    userData?.songs.sort((a,b) => {
      if (a.title < b.title) return -1;
      if (a.title > b.title) return 1;
      return 0;
    });
    return userData?.songs;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
    These lines execute the sorting and rendering of the song list, 
    and update the play button's accessible text right when the script loads. 
    This ensures that the playlist is properly displayed and accessible from the start.
*/

renderSongs(sortSongs());  // Render the sorted song list on initial load.
setPlayButtonAccessibleText();  // Update the accessible text based on the initial song.

  
  
 
  
  
  
  