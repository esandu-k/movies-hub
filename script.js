// --- GLOBALS ---
let currentUser = null;
let searchTimeout = null;

// --- TMDB (The Movie Database) API Logic ---
const TMDB_API_KEY = 'fd532763738966b6c1bf99e66511d84d'; 
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'; 
const TMDB_BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/original'; 

const endpoints = {
    trending: `/trending/all/week?api_key=${TMDB_API_KEY}&language=en-US`,
    originals: `/discover/tv?api_key=${TMDB_API_KEY}&with_networks=213&language=en-US`,
    action: `/discover/movie?api_key=${TMDB_API_KEY}&with_genres=28&language=en-US`,
    comedy: `/discover/movie?api_key=${TMDB_API_KEY}&with_genres=35&language=en-US`,
    horror: `/discover/movie?api_key=${TMDB_API_KEY}&with_genres=27&language=en-US`,
    romance: `/discover/movie?api_key=${TMDB_API_KEY}&with_genres=10749&language=en-US`,
    documentaries: `/discover/movie?api_key=${TMDB_API_KEY}&with_genres=99&language=en-US`
};

// --- Supabase Database Logic ---
const SUPABASE_URL = 'https://yvdfwxzdqfmrwxlmcslc.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_y_BjvR4qhvO-4esTCh4YRQ_lzOqagOJ'; 
const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


// --- AUTHENTICATION LOGIC ---

function checkAuth() {
    const savedUser = localStorage.getItem('movieHubUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        document.getElementById('login-modal').classList.add('hidden');
        document.getElementById('app-container').classList.remove('hidden');
        document.getElementById('profile-icon').innerText = currentUser.username.charAt(0);
        document.getElementById('dropdown-username').innerText = currentUser.username;
        initApp();
    }
}

document.getElementById('login-btn').addEventListener('click', async () => {
    const usernameInput = document.getElementById('username-input').value.trim();
    const errorMsg = document.getElementById('login-error');
    
    if (usernameInput.length < 3) {
        errorMsg.innerText = "Username must be at least 3 characters.";
        return;
    }
    
    errorMsg.innerText = "Signing in...";
    
    const { data: existingUsers, error: selectError } = await db
        .from('users')
        .select('*')
        .eq('username', usernameInput);
        
    if (existingUsers && existingUsers.length > 0) {
        currentUser = existingUsers[0];
    } else {
        const { data: newUser, error: insertError } = await db
            .from('users')
            .insert([{ username: usernameInput }])
            .select();
            
        if (insertError) {
            errorMsg.innerText = "Database error. Did you disable RLS?";
            return;
        }
        currentUser = newUser[0];
    }
    
    localStorage.setItem('movieHubUser', JSON.stringify(currentUser));
    document.getElementById('login-modal').classList.add('hidden');
    document.getElementById('app-container').classList.remove('hidden');
    document.getElementById('profile-icon').innerText = currentUser.username.charAt(0);
    document.getElementById('dropdown-username').innerText = currentUser.username;
    initApp();
});


// --- NAVBAR UI LOGIC ---

// Profile Dropdown
document.getElementById('profile-icon').addEventListener('click', (e) => {
    e.stopPropagation();
    document.getElementById('profile-dropdown').classList.toggle('hidden');
});
window.addEventListener('click', () => {
    document.getElementById('profile-dropdown').classList.add('hidden');
});
document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('movieHubUser');
    window.location.reload();
});

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});


// --- SEARCH LOGIC ---

const searchIcon = document.getElementById('search-icon');
const searchInput = document.getElementById('search-input');
const searchBox = document.querySelector('.search-box');
const homeView = document.getElementById('home-view');
const searchResultsSection = document.getElementById('search-results-section');

// Expand search bar
searchIcon.addEventListener('click', () => {
    searchBox.classList.add('active');
    searchInput.focus();
});

// Close search if clicked outside
window.addEventListener('click', (e) => {
    if (!searchBox.contains(e.target)) {
        if (searchInput.value === '') {
            searchBox.classList.remove('active');
        }
    }
});

// Home button resets search
document.getElementById('nav-home').addEventListener('click', () => {
    searchInput.value = '';
    searchBox.classList.remove('active');
    searchResultsSection.classList.add('hidden');
    homeView.classList.remove('hidden');
});

searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    
    clearTimeout(searchTimeout);
    
    if (query.length === 0) {
        searchResultsSection.classList.add('hidden');
        homeView.classList.remove('hidden');
        return;
    }
    
    // Show search view, hide home
    searchResultsSection.classList.remove('hidden');
    homeView.classList.add('hidden');
    document.getElementById('search-results-title').innerText = `Search Results for "${query}"`;
    
    // Debounce the API call
    searchTimeout = setTimeout(() => {
        fetchSearchResults(query);
    }, 500);
});

async function fetchSearchResults(query) {
    try {
        const url = `${TMDB_BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=en-US&page=1`;
        const response = await fetch(url);
        const data = await response.json();
        
        // Filter out people, we only want movies and TV shows
        const movies = data.results.filter(item => item.media_type !== 'person' && (item.backdrop_path || item.poster_path));
        
        const container = document.getElementById('search-grid');
        container.innerHTML = '';
        
        if (movies.length === 0) {
            container.innerHTML = '<p style="color: gray;">No results found.</p>';
            return;
        }
        
        renderMovies(movies, 'search-grid');
    } catch (error) {
        console.error("Error searching:", error);
    }
}


// --- APP INITIALIZATION ---
function initApp() {
    fetchMovies(endpoints.trending, 'trending-posters', true);
    fetchMovies(endpoints.originals, 'originals-posters');
    fetchMovies(endpoints.action, 'action-posters');
    fetchMovies(endpoints.comedy, 'comedy-posters');
    fetchMovies(endpoints.horror, 'horror-posters');
    fetchMovies(endpoints.romance, 'romance-posters');
    fetchMovies(endpoints.documentaries, 'documentaries-posters');
    
    setTimeout(() => fetchUserList(), 500);
}


// --- TMDB FETCHING LOGIC ---

async function fetchMovies(url, containerId, isHero = false) {
    if (TMDB_API_KEY === 'YOUR_TMDB_API_KEY_HERE') return;

    try {
        const response = await fetch(TMDB_BASE_URL + url);
        const data = await response.json();
        const movies = data.results; 
        
        if (isHero && movies.length > 0) {
            setHeroMovie(movies);
        }
        
        renderMovies(movies, containerId);
    } catch (error) {
        console.error("Error fetching from TMDB:", error);
    }
}

function setHeroMovie(movies) {
    const randomMovie = movies[Math.floor(Math.random() * movies.length)];
    const heroSection = document.getElementById('hero-section');
    const heroTitle = document.getElementById('hero-title');
    const heroOverview = document.getElementById('hero-overview');
    
    heroSection.style.backgroundImage = `url('${TMDB_BACKDROP_BASE_URL}${randomMovie.backdrop_path}')`;
    heroTitle.innerText = randomMovie.title || randomMovie.name;
    heroOverview.innerText = randomMovie.overview;
    
    document.getElementById('hero-play-btn').onclick = () => playTrailer(randomMovie);
    document.getElementById('hero-info-btn').onclick = () => openDetailsModal(randomMovie);
}

function renderMovies(movies, containerId) {
    const container = document.getElementById(containerId);
    if(!container) return;
    
    // Only clear if it's not the user's list (which is handled separately)
    if(containerId !== 'my-list-posters') {
        container.innerHTML = ''; 
    }
    
    movies.forEach(movie => {
        if (!movie.backdrop_path && !movie.poster_path) return; 

        const poster = document.createElement('div');
        poster.className = 'poster-card';
        const imagePath = movie.backdrop_path || movie.poster_path;
        const imageUrl = TMDB_IMAGE_BASE_URL + imagePath;
        poster.style.backgroundImage = `url('${imageUrl}')`;
        
        // Clicking poster opens details
        poster.onclick = () => openDetailsModal(movie);
        
        // Create Hover Info
        const infoDiv = document.createElement('div');
        infoDiv.className = 'poster-info';
        
        const titleSpan = document.createElement('span');
        titleSpan.className = 'poster-title';
        titleSpan.innerText = movie.title || movie.name;
        
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'poster-actions';
        
        const infoBtn = document.createElement('button');
        infoBtn.className = 'poster-btn info';
        infoBtn.innerHTML = 'ℹ️ Details';
        
        actionsDiv.appendChild(infoBtn);
        
        infoDiv.appendChild(titleSpan);
        infoDiv.appendChild(actionsDiv);
        poster.appendChild(infoDiv);
        
        container.appendChild(poster);
    });
}


// --- DETAILS & REVIEWS MODAL ---

async function openDetailsModal(movie) {
    const title = movie.title || movie.name;
    const mediaType = movie.media_type || (movie.name ? 'tv' : 'movie');
    const imagePath = movie.backdrop_path || movie.poster_path;
    const imageUrl = TMDB_IMAGE_BASE_URL + imagePath;
    
    // Set basic info
    document.getElementById('details-title').innerText = title;
    document.getElementById('details-overview').innerText = movie.overview || "No overview available.";
    document.getElementById('details-rating').innerText = `⭐ ${(movie.vote_average || 0).toFixed(1)}`;
    document.getElementById('details-date').innerText = (movie.release_date || movie.first_air_date || "").substring(0,4);
    
    // Set Backdrop
    const backdropUrl = movie.backdrop_path ? TMDB_BACKDROP_BASE_URL + movie.backdrop_path : imageUrl;
    document.getElementById('details-hero').style.backgroundImage = `url('${backdropUrl}')`;
    
    // Set Buttons
    const playBtn = document.getElementById('details-play-btn');
    playBtn.onclick = () => {
        document.getElementById('details-modal').classList.add('hidden');
        playTrailer(movie);
    };
    
    const addBtn = document.getElementById('details-add-btn');
    addBtn.innerHTML = "+ My List"; // Reset text
    addBtn.style.color = "white";
    addBtn.onclick = () => toggleMyList(movie, imageUrl, addBtn);
    
    // Show Modal
    document.getElementById('details-modal').classList.remove('hidden');
    
    // Fetch Reviews
    const reviewsContainer = document.getElementById('details-reviews');
    reviewsContainer.innerHTML = '<p style="color: gray;">Loading reviews...</p>';
    
    try {
        const response = await fetch(`${TMDB_BASE_URL}/${mediaType}/${movie.id}/reviews?api_key=${TMDB_API_KEY}&language=en-US`);
        const data = await response.json();
        
        reviewsContainer.innerHTML = '';
        
        if (!data.results || data.results.length === 0) {
            reviewsContainer.innerHTML = '<p style="color: gray;">No reviews available for this title.</p>';
            return;
        }
        
        // Show top 3 reviews
        const topReviews = data.results.slice(0, 3);
        topReviews.forEach(review => {
            const card = document.createElement('div');
            card.className = 'review-card';
            
            const author = document.createElement('div');
            author.className = 'review-author';
            author.innerText = review.author;
            
            const content = document.createElement('div');
            content.className = 'review-content';
            content.innerText = review.content;
            
            card.appendChild(author);
            card.appendChild(content);
            reviewsContainer.appendChild(card);
        });
        
    } catch (error) {
        console.error("Error fetching reviews:", error);
        reviewsContainer.innerHTML = '<p style="color: red;">Failed to load reviews.</p>';
    }
}

document.getElementById('close-details-btn').addEventListener('click', () => {
    document.getElementById('details-modal').classList.add('hidden');
});


// --- SUPABASE "MY LIST" LOGIC ---

async function toggleMyList(movie, imageUrl, addBtn) {
    if (!currentUser) return;
    
    const title = movie.title || movie.name;
    const mediaType = movie.media_type || (movie.name ? 'tv' : 'movie');
    
    const { data: existingEntry } = await db
        .from('user_list')
        .select('id')
        .eq('user_id', currentUser.id)
        .eq('media_id', movie.id)
        .single();
        
    if (existingEntry) {
        const { error: deleteError } = await db
            .from('user_list')
            .delete()
            .eq('id', existingEntry.id);
            
        if (!deleteError) {
            addBtn.innerHTML = "+ My List";
            addBtn.style.color = "white";
        }
    } else {
        await db.from('media').upsert({ 
            id: movie.id, 
            title: title, 
            poster_url: imageUrl,
            media_type: mediaType
        });
        
        const { error: insertError } = await db.from('user_list').insert({
            user_id: currentUser.id,
            media_id: movie.id
        });
        
        if (!insertError) {
            addBtn.innerHTML = "✓ Added";
            addBtn.style.color = "#46d369"; 
        }
    }
    
    fetchUserList(); 
}

async function fetchUserList() {
    if (!currentUser) return;
    
    const { data, error } = await db
        .from('user_list')
        .select(`
            id,
            media ( id, title, poster_url )
        `)
        .eq('user_id', currentUser.id); 

    if (error) {
        console.error("Error fetching JOIN data:", error);
        return;
    }

    const container = document.getElementById('my-list-posters');
    container.innerHTML = ''; 
    
    if (data.length === 0) {
        container.innerHTML = '<p style="color: gray; padding: 20px;">Your list is empty.</p>';
        return;
    }
    
    // Format data to match TMDB structure for the renderer
    const formattedMovies = data.map(item => ({
        id: item.media.id,
        title: item.media.title,
        poster_path: item.media.poster_url.replace(TMDB_IMAGE_BASE_URL, '') // Extract just the path
    }));
    
    renderMovies(formattedMovies, 'my-list-posters');
}


// --- VIDEO PLAYER LOGIC ---

const MOVIE_EMBED_API = ""; 
const TV_EMBED_API = ""; 

async function playTrailer(movie) {
    const mediaType = movie.media_type || (movie.name ? 'tv' : 'movie');
    const videoModal = document.getElementById('video-modal');
    const videoFrame = document.getElementById('video-frame');
    
    if (mediaType === 'movie' && MOVIE_EMBED_API !== "") {
        videoFrame.src = MOVIE_EMBED_API + movie.id;
        videoModal.classList.remove('hidden');
        return;
    } 
    
    if (mediaType === 'tv' && TV_EMBED_API !== "") {
        videoFrame.src = TV_EMBED_API + movie.id + "&season=1&episode=1";
        videoModal.classList.remove('hidden');
        return;
    }
    
    try {
        const response = await fetch(`${TMDB_BASE_URL}/${mediaType}/${movie.id}/videos?api_key=${TMDB_API_KEY}&language=en-US`);
        const data = await response.json();
        
        if (!data.results || data.results.length === 0) {
            alert("No video found for this title!");
            return;
        }
        
        const trailer = data.results.find(v => v.site === "YouTube" && v.type === "Trailer") || data.results[0];
        
        if (trailer && trailer.site === "YouTube") {
            videoFrame.src = `https://www.youtube.com/embed/${trailer.key}?autoplay=1`;
            videoModal.classList.remove('hidden');
        } else {
            alert("No YouTube video available!");
        }
        
    } catch (error) {
        console.error("Error fetching video:", error);
        alert("Failed to load video.");
    }
}

document.getElementById('close-video-btn').addEventListener('click', () => {
    const videoModal = document.getElementById('video-modal');
    const videoFrame = document.getElementById('video-frame');
    videoFrame.src = ""; 
    videoModal.classList.add('hidden');
});

// --- BOOTSTRAP ---
checkAuth();
