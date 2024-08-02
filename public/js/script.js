// script.js

document.addEventListener('DOMContentLoaded', () => {
    const postForm = document.getElementById('postForm');
    const postsContainer = document.getElementById('posts');
    const paginationContainer = document.getElementById('pagination');
    const createPostButton = document.getElementById('createPostButton');
    const deletePostButton = document.getElementById('deletePostButton');
    const editPostButton = document.getElementById('editPostButton');
    const backToListButton = document.getElementById('backToListButton');
    const postImageInput = document.getElementById('postImage');
    const postContentDisplay = document.getElementById('postContentDisplay');
    const loginButton = document.getElementById('loginButton');
    const loginModal = document.getElementById('loginModal');
    const closeButton = document.getElementById('closeButton');
    const loginForm = document.getElementById('loginForm');
    const postsPerPage = 10;
    let currentPage = 1;
    let posts = JSON.parse(localStorage.getItem('posts')) || [];
    let currentPostIndex = null;

    function setLogoutButton() {
        loginButton.innerText = '로그아웃';
        loginButton.id = 'logoutButton';
        document.getElementById('logoutButton').addEventListener('click', () => {
            alert('로그아웃 성공');
            localStorage.removeItem('loggedIn');
            location.reload();
        });
    }

    function showButtonsForLoggedInUser() {
        if (localStorage.getItem('loggedIn') === 'true') {
            if (createPostButton) createPostButton.style.display = 'block';
        } else {
            if (createPostButton) createPostButton.style.display = 'none';
            if (deletePostButton) deletePostButton.style.display = 'none';
            if (editPostButton) editPostButton.style.display = 'none';
        }
    }

    if (localStorage.getItem('loggedIn') === 'true') {
        setLogoutButton();
        showButtonsForLoggedInUser();
    } else {
        showButtonsForLoggedInUser();
    }

    loginButton.addEventListener('click', () => {
        if (loginButton.id === 'logoutButton') {
            alert('로그아웃 성공');
            localStorage.removeItem('loggedIn');
            location.reload();
        } else {
            loginModal.style.display = 'flex';
        }
    });

    closeButton.addEventListener('click', () => {
        loginModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === loginModal) {
            loginModal.style.display = 'none';
        }
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (username === 'qkrwjdvkf123' && password === 'qkrwjdvkf1!1!') {
            alert('로그인 성공');
            localStorage.setItem('loggedIn', 'true');
            loginModal.style.display = 'none';
            setLogoutButton();
            showButtonsForLoggedInUser();
        } else {
            alert('로그인 실패');
        }
    });

    if (createPostButton) {
        createPostButton.addEventListener('click', () => {
            postForm.classList.remove('hidden');
            createPostButton.style.display = 'none';
        });
    }

    if (postImageInput) {
        postImageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    const imageElement = `<img src="${event.target.result}" alt="Post Image" style="max-width: 100%; height: auto; margin-top: 10px;">`;
                    postContentDisplay.innerHTML += imageElement;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    if (postForm) {
        postForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const postTitle = document.getElementById('postTitle').value;
            const postContentValue = postContentDisplay.innerHTML;
            const postDate = new Date().toLocaleDateString();

            const post = {
                title: postTitle,
                content: postContentValue,
                date: postDate
            };

            posts.unshift(post);
            localStorage.setItem('posts', JSON.stringify(posts));
            postForm.reset();
            postContentDisplay.innerHTML = '';
            postForm.classList.add('hidden');
            if (createPostButton) createPostButton.style.display = 'block';
            renderPosts();
            renderPagination();
        });
    }

    if (deletePostButton) {
        deletePostButton.addEventListener('click', () => {
            if (currentPostIndex !== null) {
                posts.splice(currentPostIndex, 1);
                localStorage.setItem('posts', JSON.stringify(posts));
                currentPostIndex = null;
                renderPosts();
                renderPagination();
                deletePostButton.classList.add('hidden');
                editPostButton.classList.add('hidden');
                backToListButton.classList.add('hidden');
                if (createPostButton) createPostButton.classList.remove('hidden');
            }
        });
    }

    if (editPostButton) {
        editPostButton.addEventListener('click', () => {
            if (currentPostIndex !== null) {
                const post = posts[currentPostIndex];
                document.getElementById('postTitle').value = post.title;
                postContentDisplay.innerHTML = post.content;
                postForm.classList.remove('hidden');
                if (createPostButton) createPostButton.style.display = 'none';
                deletePostButton.classList.add('hidden');
                editPostButton.classList.add('hidden');
                backToListButton.classList.add('hidden');
                postForm.onsubmit = (e) => {
                    e.preventDefault();
                    post.title = document.getElementById('postTitle').value;
                    post.content = postContentDisplay.innerHTML;
                    post.date = new Date().toLocaleDateString();

                    posts[currentPostIndex] = post;
                    localStorage.setItem('posts', JSON.stringify(posts));
                    postForm.reset();
                    postContentDisplay.innerHTML = '';
                    postForm.classList.add('hidden');
                    if (createPostButton) createPostButton.style.display = 'block';
                    renderPosts();
                    renderPagination();
                    postForm.onsubmit = null;
                };
            }
        });
    }

    if (backToListButton) {
        backToListButton.addEventListener('click', () => {
            renderPosts();
            renderPagination();
            deletePostButton.classList.add('hidden');
            editPostButton.classList.add('hidden');
            backToListButton.classList.add('hidden');
            if (createPostButton) createPostButton.classList.remove('hidden');
        });
    }

    function renderPosts() {
        if (!postsContainer) return;
        postsContainer.innerHTML = '';
        const start = (currentPage - 1) * postsPerPage;
        const end = start + postsPerPage;
        const postsToDisplay = posts.slice(start, end);

        postsToDisplay.forEach((post, index) => {
            const postElement = document.createElement('div');
            postElement.classList.add('post');
            postElement.innerHTML = `
                <span class="post-number">${start + index + 1}</span>
                <span class="post-title">${post.title}</span>
                <span class="post-date">${post.date}</span>
                <div class="post-content">${post.content}</div>
            `;
            postElement.querySelector('.post-title').addEventListener('click', () => {
                showPostDetails(postElement, start + index);
            });
            postsContainer.appendChild(postElement);
        });
    }

    function showPostDetails(postElement, index) {
        const allPosts = document.querySelectorAll('.post');
        allPosts.forEach(post => post.style.display = 'none');
        postElement.style.display = 'block';
        postElement.classList.add('active');
        postElement.querySelector('.post-content').style.display = 'block';
        if (localStorage.getItem('loggedIn') === 'true') {
            if (createPostButton) createPostButton.classList.add('hidden');
            deletePostButton.classList.remove('hidden');
            editPostButton.classList.remove('hidden');
            backToListButton.classList.remove('hidden');
        }
        currentPostIndex = index;
    }

    function renderPagination() {
        if (!paginationContainer) return;
        paginationContainer.innerHTML = '';
        const totalPages = Math.ceil(posts.length / postsPerPage);

        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            pageButton.classList.add('page-button');
            if (i === currentPage) {
                pageButton.classList.add('active');
            }

            pageButton.addEventListener('click', () => {
                currentPage = i;
                renderPosts();
                renderPagination();
            });

            paginationContainer.appendChild(pageButton);
        }
    }

    renderPosts();
    renderPagination();

    const burger = document.querySelector('.burger');
    const navLinks = document.querySelector('.nav-links');
    burger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
});
