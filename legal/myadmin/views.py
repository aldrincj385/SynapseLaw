from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
import os
from datetime import datetime
import random


# Homepage view - checks if user is logged in
def main_home(request):
    """Homepage view"""
    context = {
        'user': request.user  # Pass user object to template
    }
    return render(request, 'main_home.html', context)


# Registration view
def register_view(request):
    """Registration view"""
    if request.method == 'POST':
        # Get form data
        first_name = request.POST.get('First_Name', '')
        last_name = request.POST.get('Last_Name', '')
        email = request.POST.get('email', '')
        username = request.POST.get('username', '')
        password = request.POST.get('password', '')
        confirm_password = request.POST.get('confirm_password', '')

        # Validation
        if password != confirm_password:
            messages.error(request, 'Passwords do not match.')
        elif User.objects.filter(username=username).exists():
            messages.error(request, 'Username already exists.')
        elif User.objects.filter(email=email).exists():
            messages.error(request, 'Email already registered.')
        elif not all([first_name, last_name, email, username, password]):
            messages.error(request, 'Please fill all fields.')
        else:
            # Create new user
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name
            )
            user.save()

            # Log the user in
            login(request, user)
            messages.success(request, f'Welcome {first_name}! Registration successful.')
            return redirect('main_home')

    # If user is already logged in, redirect to home
    if request.user.is_authenticated:
        return redirect('main_home')

    return render(request, 'register.html')


# Login view
def login_view(request):
    """Login view"""
    if request.method == 'POST':
        username = request.POST.get('username', '')
        password = request.POST.get('password', '')

        # Authenticate user
        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            messages.success(request, f'Welcome back, {user.first_name}!')
            return redirect('main_home')
        else:
            messages.error(request, 'Invalid username or password.')

    # If user is already logged in, redirect to home
    if request.user.is_authenticated:
        return redirect('main_home')

    return render(request, 'login_view.html')


# Logout view
def logout_view(request):
    """Logout view"""
    logout(request)
    messages.success(request, 'You have been logged out successfully.')
    return redirect('main_home')


# Profile view (requires login)
@login_required
def profile_view(request):
    """User profile view"""
    context = {
        'user': request.user
    }
    return render(request, 'profile.html', context)


# Document analysis views (keep your existing)
def analyze_document(request):
    """Handle document upload and redirect to analysis page"""
    if request.method == 'POST':
        # Handle file upload
        uploaded_file = request.FILES.get('document')

        if uploaded_file:
            # Save file info in session
            request.session['document_info'] = {
                'name': uploaded_file.name,
                'size': f"{uploaded_file.size / 1024:.1f} KB",
                'type': os.path.splitext(uploaded_file.name)[1].upper().replace('.', ''),
                'upload_date': datetime.now().strftime("%Y-%m-%d %H:%M"),
                'analysis_complete': False
            }

            # Redirect to analysis page
            return redirect('analysis_page')

    # If GET request or no file, redirect to sample
    if request.GET.get('sample'):
        request.session['document_info'] = {
            'name': 'sample_employment_agreement.pdf',
            'size': '245.6 KB',
            'type': 'PDF',
            'upload_date': datetime.now().strftime("%Y-%m-%d %H:%M"),
            'analysis_complete': True
        }
        return redirect('analysis_page')

    # If nothing to analyze, go back home
    return redirect('main_home')


def analysis_page(request):
    """Show analysis results page"""
    document_info = request.session.get('document_info', {})

    if not document_info:
        return redirect('main_home')

    # Check if analysis is complete
    if document_info.get('analysis_complete', False):
        # Generate sample analysis data
        context = {
            'analysis_complete': True,
            'document_name': document_info.get('name', 'Unknown Document'),
            'document_type': document_info.get('type', 'Unknown'),
            'upload_date': document_info.get('upload_date', ''),
            'page_count': random.randint(5, 25),
            'word_count': random.randint(1500, 5000),
            'analysis_time': f"{random.randint(3, 12)} seconds",
            'risk_score': 65,
            'risk_class': 'medium',
            'risk_level': 'Medium',
        }
    else:
        # Show loading page
        context = {
            'analysis_complete': False,
            'document_name': document_info.get('name', 'Unknown Document')
        }

    return render(request, 'analysis.html', context)