package com.internalpj.crm_mini.mapper;

import com.internalpj.crm_mini.dto.response.CommentResponse;
import com.internalpj.crm_mini.entity.Comment;
import com.internalpj.crm_mini.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface CommentMapper {

    @Mapping(target = "user", source = "user", qualifiedByName = "toUserInfo")
    CommentResponse toResponse(Comment comment);

    @Named("toUserInfo")
    default CommentResponse.CommentUserInfo toUserInfo(User user) {
        if (user == null)
            return null;
        return CommentResponse.CommentUserInfo.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .avatarUrl("https://api.dicebear.com/7.x/avataaars/svg?seed=" + user.getUsername())
                .build();
    }
}
