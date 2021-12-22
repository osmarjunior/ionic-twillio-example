package com.example.twilio.video.service;

import com.twilio.base.ResourceSet;
import com.twilio.jwt.accesstoken.AccessToken;
import com.twilio.jwt.accesstoken.ChatGrant;
import com.twilio.jwt.accesstoken.VideoGrant;
import com.twilio.rest.conversations.v1.Conversation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class VideoService {

    @Value("${twilio.account-sid}")
    private String twilioAccountSid;

    @Value("${twilio.api-key}")
    private String twilioApiKey;

    @Value("${twilio.api-secret}")
    private String twilioApiSecret;

    public VideoService() {
    }

    public Conversation getChatRoom(String name) {
        ResourceSet<Conversation> conversations = Conversation.reader()
                .limit(20).read();

        for(Conversation conversation : conversations) {

            log.info(conversation.toString());

            if(conversation.getUniqueName().equals(name)) {
                return conversation;
            }
        }

        return Conversation.creator().setUniqueName(name).create();
    }

    public String getToken(String identity, Conversation conversation, String roomName) {

        System.out.println(identity);

        // Create Video grant
        final VideoGrant videoGrant = new VideoGrant().setRoom(roomName);

        final ChatGrant chatGrant = new ChatGrant();
        chatGrant.setServiceSid(conversation.getChatServiceSid());

        // Create access token
        final AccessToken token = new AccessToken.Builder(
                twilioAccountSid,
                twilioApiKey,
                twilioApiSecret
        ).identity(identity)
                .grant(videoGrant)
                .grant(chatGrant).build();

        return token.toJwt();
    }
}
