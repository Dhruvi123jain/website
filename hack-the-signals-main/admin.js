// Admin Dashboard for Hack The Signals
// This file handles the admin interface functionality

import {
    deleteRegistration,
    getAllRegistrations,
    getCurrentUser,
    getGlimpses,
    getRegistrationById,
    getRegistrationsByMembershipType, getRegistrationStats,
    isAdmin,
    logOut,
    setGlimpses,
    signIn
} from './database-service.js';

document.addEventListener('DOMContentLoaded', async function() {
    // DOM Elements
    const loginSection = document.getElementById('login-section');
    const dashboardSection = document.getElementById('dashboard-section');
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');
    const logoutBtn = document.getElementById('logout-btn');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const filterSelect = document.getElementById('filter-select');
    const exportBtn = document.getElementById('export-btn');
    const registrationsTable = document.getElementById('registrations-table');
    const registrationsBody = document.getElementById('registrations-body');
    const noResults = document.getElementById('no-results');
    const loading = document.getElementById('loading');
    const detailsModal = document.getElementById('details-modal');
    const registrationDetails = document.getElementById('registration-details');
    const closeModalBtn = document.querySelector('.close-modal');
    const closeDetailsBtn = document.getElementById('close-details');
    const deleteRegistrationBtn = document.getElementById('delete-registration');

    // Stats elements
    const totalRegistrationsEl = document.getElementById('total-registrations');
    const csSpsEl = document.getElementById('cs-sps-members');
    const ieeeEl = document.getElementById('ieee-members');
    const nonIeeeEl = document.getElementById('non-ieee-members');
    const uniqueTeamsEl = document.getElementById('unique-teams');

    // Current state
    let currentRegistrations = [];
    let currentRegistrationId = null;

    // Check authentication state
    checkAuthState();

    // Event Listeners
    loginForm.addEventListener('submit', handleLogin);
    logoutBtn.addEventListener('click', handleLogout);
    searchBtn.addEventListener('click', handleSearch);
    filterSelect.addEventListener('change', handleFilter);
    exportBtn.addEventListener('click', handleExport);
    closeModalBtn.addEventListener('click', closeModal);
    closeDetailsBtn.addEventListener('click', closeModal);
    deleteRegistrationBtn.addEventListener('click', handleDeleteRegistration);

    // Search input - search on enter key
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });

    // Check if user is authenticated and is an admin
    async function checkAuthState() {
        try {
            const user = await getCurrentUser();
            const adminStatus = await isAdmin();
            
            if (user && adminStatus) {
                // User is authenticated and is an admin
                loginSection.classList.add('hidden');
                dashboardSection.classList.remove('hidden');
                
                // Load dashboard data
                loadDashboardData();
            } else {
                // User is not authenticated or is not an admin
                loginSection.classList.remove('hidden');
                dashboardSection.classList.add('hidden');
            }
        } catch (error) {
            console.error('Error checking auth state:', error);
            showLoginError('Authentication error. Please try again.');
        }
    }

    // Handle login form submission
    async function handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        try {
            // Clear previous errors
            loginError.textContent = '';
            
            // Show loading state
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Logging in...';
            submitBtn.disabled = true;
            
            // Sign in
            await signIn(email, password);
            
            // Check if user is an admin
            const adminStatus = await isAdmin();
            
            if (adminStatus) {
                // User is an admin, show dashboard
                loginSection.classList.add('hidden');
                dashboardSection.classList.remove('hidden');
                
                // Load dashboard data
                loadDashboardData();
            } else {
                // User is not an admin
                showLoginError('You do not have admin privileges.');
                await logOut(); // Sign out non-admin user
            }
        } catch (error) {
            console.error('Login error:', error);
            showLoginError('Invalid email or password.');
        } finally {
            // Reset button state
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            submitBtn.textContent = 'Login';
            submitBtn.disabled = false;
        }
    }

    // Handle logout
    async function handleLogout() {
        try {
            await logOut();
            loginSection.classList.remove('hidden');
            dashboardSection.classList.add('hidden');
        } catch (error) {
            console.error('Logout error:', error);
        }
    }

    // Load dashboard data
    async function loadDashboardData() {
        try {
            // Show loading state
            loading.classList.remove('hidden');
            noResults.classList.add('hidden');
            registrationsBody.innerHTML = '';
            
            // Load registrations
            currentRegistrations = await getAllRegistrations();
            
            // Update table
            updateRegistrationsTable(currentRegistrations);
            
            // Load stats
            const stats = await getRegistrationStats();
            updateStatsDisplay(stats);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            noResults.classList.remove('hidden');
            noResults.querySelector('p').textContent = 'Error loading data. Please try again.';
        } finally {
            loading.classList.add('hidden');
        }
    }

    // Update registrations table
    function updateRegistrationsTable(registrations) {
        // Clear table
        registrationsBody.innerHTML = '';
        
        if (registrations.length === 0) {
            // Show no results message
            noResults.classList.remove('hidden');
            return;
        }
        
        // Hide no results message
        noResults.classList.add('hidden');
        
        // Add rows to table
        registrations.forEach(registration => {
            const row = document.createElement('tr');
            
            // Format date
            const date = registration.createdAt ? new Date(registration.createdAt.seconds * 1000) : new Date();
            const formattedDate = date.toLocaleDateString();
            
            // Create row content
            row.innerHTML = `
                <td>${registration['first-name'] || ''} ${registration['last-name'] || ''}</td>
                <td>${registration['email'] || ''}</td>
                <td>${registration['phone'] || ''}</td>
                <td>${registration['college'] || ''}</td>
                <td>${getMembershipLabel(registration['membership-type'])}</td>
                <td>${registration['team-name'] || ''}</td>
                <td>${formattedDate}</td>
                <td class="actions">
                    <button class="action-btn view-btn" data-id="${registration.id}">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn delete-btn" data-id="${registration.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            
            // Add row to table
            registrationsBody.appendChild(row);
            
            // Add event listeners to buttons
            const viewBtn = row.querySelector('.view-btn');
            const deleteBtn = row.querySelector('.delete-btn');
            
            viewBtn.addEventListener('click', () => showRegistrationDetails(registration.id));
            deleteBtn.addEventListener('click', () => confirmDeleteRegistration(registration.id));
        });
    }

    // Update stats display
    function updateStatsDisplay(stats) {
        if (!stats) return;
        
        totalRegistrationsEl.textContent = stats.totalRegistrations || 0;
        csSpsEl.textContent = stats.csSpsMembers || 0;
        ieeeEl.textContent = stats.ieeeMembers || 0;
        nonIeeeEl.textContent = stats.nonIeeeMembers || 0;
        uniqueTeamsEl.textContent = stats.uniqueTeams || 0;
    }

    // Handle search
    function handleSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        if (!searchTerm) {
            // If search term is empty, show all registrations
            updateRegistrationsTable(currentRegistrations);
            return;
        }
        
        // Filter registrations by search term
        const filteredRegistrations = currentRegistrations.filter(registration => {
            const firstName = (registration['first-name'] || '').toLowerCase();
            const lastName = (registration['last-name'] || '').toLowerCase();
            const email = (registration['email'] || '').toLowerCase();
            const phone = (registration['phone'] || '').toLowerCase();
            const college = (registration['college'] || '').toLowerCase();
            const teamName = (registration['team-name'] || '').toLowerCase();
            
            return firstName.includes(searchTerm) ||
                   lastName.includes(searchTerm) ||
                   email.includes(searchTerm) ||
                   phone.includes(searchTerm) ||
                   college.includes(searchTerm) ||
                   teamName.includes(searchTerm);
        });
        
        // Update table with filtered registrations
        updateRegistrationsTable(filteredRegistrations);
    }

    // Handle filter
    async function handleFilter() {
        const filterValue = filterSelect.value;
        
        try {
            // Show loading state
            loading.classList.remove('hidden');
            noResults.classList.add('hidden');
            registrationsBody.innerHTML = '';
            
            if (filterValue === 'all') {
                // Show all registrations
                currentRegistrations = await getAllRegistrations();
            } else {
                // Filter by membership type
                currentRegistrations = await getRegistrationsByMembershipType(filterValue);
            }
            
            // Update table
            updateRegistrationsTable(currentRegistrations);
        } catch (error) {
            console.error('Error filtering registrations:', error);
            noResults.classList.remove('hidden');
            noResults.querySelector('p').textContent = 'Error filtering data. Please try again.';
        } finally {
            loading.classList.add('hidden');
        }
    }

    // Handle export to CSV
    function handleExport() {
        if (currentRegistrations.length === 0) {
            alert('No data to export.');
            return;
        }
        
        // Create CSV content
        let csvContent = 'data:text/csv;charset=utf-8,';
        
        // Add headers
        csvContent += 'First Name,Last Name,Email,Phone,College,Membership Type,Team Name,Experience Level,IEEE Membership,Dietary Restrictions,Registration Date\n';
        
        // Add rows
        currentRegistrations.forEach(registration => {
            const date = registration.createdAt ? new Date(registration.createdAt.seconds * 1000) : new Date();
            const formattedDate = date.toLocaleDateString();
            
            const row = [
                `"${registration['first-name'] || ''}"`,
                `"${registration['last-name'] || ''}"`,
                `"${registration['email'] || ''}"`,
                `"${registration['phone'] || ''}"`,
                `"${registration['college'] || ''}"`,
                `"${getMembershipLabel(registration['membership-type'])}"`,
                `"${registration['team-name'] || ''}"`,
                `"${registration['experience-level'] || ''}"`,
                `"${registration['ieee-membership'] || ''}"`,
                `"${registration['dietary-restrictions'] || ''}"`,
                `"${formattedDate}"`
            ];
            
            csvContent += row.join(',') + '\n';
        });
        
        // Create download link
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `hack-the-signals-registrations-${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        
        // Trigger download
        link.click();
        
        // Clean up
        document.body.removeChild(link);
    }

    // Show registration details
    async function showRegistrationDetails(id) {
        try {
            // Set current registration ID
            currentRegistrationId = id;
            
            // Get registration details
            const registration = await getRegistrationById(id);
            
            if (!registration) {
                alert('Registration not found.');
                return;
            }
            
            // Format date
            const date = registration.createdAt ? new Date(registration.createdAt.seconds * 1000) : new Date();
            const formattedDate = date.toLocaleString();
            
            // Create details HTML
            let detailsHTML = `
                <div class="detail-group">
                    <div class="detail-label">Name</div>
                    <div class="detail-value">${registration['first-name'] || ''} ${registration['last-name'] || ''}</div>
                </div>
                <div class="detail-group">
                    <div class="detail-label">Email</div>
                    <div class="detail-value">${registration['email'] || ''}</div>
                </div>
                <div class="detail-group">
                    <div class="detail-label">Phone</div>
                    <div class="detail-value">${registration['phone'] || ''}</div>
                </div>
                <div class="detail-group">
                    <div class="detail-label">College/University</div>
                    <div class="detail-value">${registration['college'] || ''}</div>
                </div>
                <div class="detail-group">
                    <div class="detail-label">Membership Type</div>
                    <div class="detail-value">${getMembershipLabel(registration['membership-type'])}</div>
                </div>
                <div class="detail-group">
                    <div class="detail-label">IEEE Membership Number</div>
                    <div class="detail-value">${registration['ieee-membership'] || 'N/A'}</div>
                </div>
                <div class="detail-group">
                    <div class="detail-label">Team Name</div>
                    <div class="detail-value">${registration['team-name'] || ''}</div>
                </div>
                <div class="detail-group">
                    <div class="detail-label">Team Members</div>
                    <div class="detail-value">${registration['team-members'] || 'N/A'}</div>
                </div>
                <div class="detail-group">
                    <div class="detail-label">Experience Level</div>
                    <div class="detail-value">${capitalizeFirstLetter(registration['experience-level'] || '')}</div>
                </div>
                <div class="detail-group">
                    <div class="detail-label">Dietary Restrictions</div>
                    <div class="detail-value">${registration['dietary-restrictions'] || 'None'}</div>
                </div>
                <div class="detail-group">
                    <div class="detail-label">Registration Date</div>
                    <div class="detail-value">${formattedDate}</div>
                </div>
            `;
            
            // Update details container
            registrationDetails.innerHTML = detailsHTML;
            
            // Show modal
            detailsModal.classList.add('active');
            detailsModal.style.opacity = '0';
            setTimeout(() => {
                detailsModal.style.opacity = '1';
            }, 10);
        } catch (error) {
            console.error('Error showing registration details:', error);
            alert('Error loading registration details. Please try again.');
        }
    }

    // Confirm delete registration
    function confirmDeleteRegistration(id) {
        if (confirm('Are you sure you want to delete this registration? This action cannot be undone.')) {
            handleDeleteRegistration(id);
        }
    }

    // Handle delete registration
    async function handleDeleteRegistration(id) {
        try {
            // If called from delete button in modal, use currentRegistrationId
            const registrationId = id || currentRegistrationId;
            
            if (!registrationId) {
                alert('No registration selected.');
                return;
            }
            
            // Delete registration
            await deleteRegistration(registrationId);
            
            // Close modal if open
            if (detailsModal.classList.contains('active')) {
                closeModal();
            }
            
            // Reload dashboard data
            loadDashboardData();
            
            // Show success message
            alert('Registration deleted successfully.');
        } catch (error) {
            console.error('Error deleting registration:', error);
            alert('Error deleting registration. Please try again.');
        }
    }

    // Close modal
    function closeModal() {
        detailsModal.style.opacity = '0';
        setTimeout(() => {
            detailsModal.classList.remove('active');
            currentRegistrationId = null;
        }, 300);
    }

    // Helper function to show login error
    function showLoginError(message) {
        loginError.textContent = message;
    }

    // Helper function to get membership label
    function getMembershipLabel(type) {
        const labels = {
            'cs-sps': 'IEEE CS/SPS Member',
            'ieee': 'IEEE Member',
            'non-ieee': 'Non-IEEE Member'
        };
        
        return labels[type] || type;
    }

    // Helper function to capitalize first letter
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // Glimpses editor functionality
    async function loadGlimpsesEditor() {
        const glimpsesInputs = document.getElementById('glimpses-inputs');
        if (!glimpsesInputs) return;
        const glimpses = await getGlimpses();
        glimpsesInputs.innerHTML = '';
        for (let i = 0; i < 5; i++) {
            glimpsesInputs.innerHTML += `
                <div class="form-group">
                    <label>Image ${i + 1} URL</label>
                    <input type="text" name="glimpse${i}" value="${glimpses && glimpses[i] ? glimpses[i] : ''}" style="width:100%">
                </div>
            `;
        }
    }

    loadGlimpsesEditor();

    const glimpsesForm = document.getElementById('glimpses-form');
    if (glimpsesForm) {
        glimpsesForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const urls = [];
            for (let i = 0; i < 5; i++) {
                urls.push(document.querySelector(`[name="glimpse${i}"]`).value.trim());
            }
            await setGlimpses(urls);
            document.getElementById('glimpses-save-status').textContent = 'Saved!';
            setTimeout(() => document.getElementById('glimpses-save-status').textContent = '', 2000);
        });
    }
});
