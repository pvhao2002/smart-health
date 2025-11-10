package com.health.service;

import com.health.dto.admin.UpdateUserStatusRequest;
import com.health.dto.admin.UserResponse;
import com.health.dto.common.MessageResponse;
import com.health.dto.common.PagedResponse;
import com.health.dto.user.ChangePasswordRequest;
import com.health.dto.user.UpdateUserProfileRequest;
import com.health.dto.user.UserProfileResponse;

public interface UserService {

    PagedResponse<UserResponse> getAllUsers(int page, int size, String search);

    UserResponse updateUserStatus(Long userId, UpdateUserStatusRequest request);

    UserResponse getUserById(Long userId);

    UserProfileResponse getUserProfile(String userEmail);

    UserProfileResponse updateUserProfile(String userEmail, UpdateUserProfileRequest request);

    MessageResponse changePassword(String userEmail, ChangePasswordRequest request);
}