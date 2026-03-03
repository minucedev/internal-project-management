package com.internalpj.crm_mini.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.internalpj.crm_mini.common.ApiResponse;
import com.internalpj.crm_mini.dto.request.InviteMemberRequest;
import com.internalpj.crm_mini.dto.response.InviteResponse;
import com.internalpj.crm_mini.dto.response.MemberDetailResponse;
import com.internalpj.crm_mini.dto.response.MemberListResponse;
import com.internalpj.crm_mini.service.MemberService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 * REST controller for managing project members with invitation system.
 */
@RestController
@RequestMapping("/api/projects/{projectId}/members")
@Tag(name = "Member Management", description = "APIs for managing project members via invitations")
@SecurityRequirement(name = "bearerAuth")
@RequiredArgsConstructor
public class MemberController {

        private final MemberService memberService;

        /**
         * Invite a user to join the project.
         * Creates PENDING invitation and sends email.
         * Only LEADERs can invite.
         */
        @PostMapping("/invite")
        @Operation(summary = "Invite member to project", description = "Creates an invitation with a unique token and sends an email. "
                        +
                        "Only LEADER can invite members.")
        @ApiResponses(value = {
                        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Invitation created and email sent"),
                        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid request"),
                        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Only LEADER can invite"),
                        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "User or project not found"),
                        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "User already member or has pending invite")
        })
        public ResponseEntity<ApiResponse<InviteResponse>> inviteMember(
                        @Parameter(description = "Project ID", required = true) @PathVariable Long projectId,
                        @Valid @RequestBody InviteMemberRequest request) {

                return ResponseEntity.ok(
                                ApiResponse.success(memberService.inviteMember(projectId, request)));
        }

        /**
         * Accept invitation and join project.
         * Token must be valid and not expired.
         */
        @PostMapping("/invites/{token}/accept")
        @Operation(summary = "Accept invitation", description = "Accept an invitation using the token from the email link.")
        @ApiResponses(value = {
                        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Invitation accepted successfully"),
                        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid or expired token"),
                        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Token is for a different user"),
                        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Invitation not found")
        })
        public ResponseEntity<ApiResponse<MemberDetailResponse>> acceptInvitation(
                        @Parameter(description = "Project ID", required = true) @PathVariable Long projectId,
                        @Parameter(description = "Invitation token", required = true) @PathVariable String token) {

                return ResponseEntity.ok(
                                ApiResponse.success(memberService.acceptInvitation(token)));
        }

        /**
         * Get all members of the project.
         * LEADERs can optionally include PENDING invitations.
         */
        @GetMapping
        @Operation(summary = "Get project members", description = "Get list of project members. LEADERs can optionally include pending invitations.")
        @ApiResponses(value = {
                        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Members retrieved successfully"),
                        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Not a member of this project"),
                        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Project not found")
        })
        public ResponseEntity<ApiResponse<MemberListResponse>> getMembers(
                        @Parameter(description = "Project ID", required = true) @PathVariable Long projectId,
                        @Parameter(description = "Include pending invitations (LEADER only)", required = false) @RequestParam(defaultValue = "false") boolean includePending,
                        @Parameter(description = "Page number (0-indexed)", required = false) @RequestParam(defaultValue = "0") int page,
                        @Parameter(description = "Page size", required = false) @RequestParam(defaultValue = "20") int size,
                        @Parameter(description = "Sort field (username, email, role, joinedAt)", required = false) @RequestParam(defaultValue = "joinedAt") String sortBy) {

                return ResponseEntity.ok(
                                ApiResponse.success(memberService.getMembers(projectId, includePending, page, size, sortBy)));
        }

        /**
         * Remove a member from the project.
         * Only LEADERs can remove members.
         * Cannot remove the last LEADER.
         */
        @DeleteMapping("/{userId}")
        @Operation(summary = "Remove member from project", description = "Remove a member from the project. Only LEADER can remove. Cannot remove the last LEADER.")
        @ApiResponses(value = {
                        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Member removed successfully"),
                        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Cannot remove last LEADER"),
                        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Only LEADER can remove members"),
                        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Member not found")
        })
        public ResponseEntity<ApiResponse<Void>> removeMember(
                        @Parameter(description = "Project ID", required = true) @PathVariable Long projectId,
                        @Parameter(description = "User ID to remove", required = true) @PathVariable Long userId) {

                memberService.removeMember(projectId, userId);
                return ResponseEntity.ok(ApiResponse.success());
        }
}
