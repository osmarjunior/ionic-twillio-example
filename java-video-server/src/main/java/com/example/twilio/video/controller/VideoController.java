package com.example.twilio.video.controller;

import com.example.twilio.video.service.VideoService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.twilio.base.ResourceSet;
import com.twilio.rest.conversations.v1.Conversation;
import com.twilio.rest.conversations.v1.conversation.Participant;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/video")
public class VideoController {

    @Autowired
    private VideoService videoService;

    @CrossOrigin
    @GetMapping(value = "/token", produces = "application/json")
    public ResponseEntity<JsonNode> getToken(@RequestParam String identity, @RequestParam String roomName) throws JsonProcessingException {

        Conversation conversation = videoService.getChatRoom(roomName);

        //Add participant
        Participant participant = getParticipant(identity, conversation);

        ObjectMapper mapper = new ObjectMapper();
        JsonNode json = mapper.readTree("{\"token\":\"" + videoService.getToken(identity, conversation, roomName) + "\", \"identity\":\"" + identity + "\", \"conversation_sid\":\"" + conversation.getSid() + "\", \"participant_sid\":\"" + participant.getSid() + "\" }");
        return ResponseEntity.ok(json);
    }

    private Participant getParticipant(String identity, Conversation conversation) {

        ResourceSet<Participant> participants = Participant.reader(conversation.getSid()).limit(200).read();

        for(Participant participant : participants) {
            if(participant.getIdentity().equals(identity)) {
                return participant;
            }
        }

        return Participant.creator(conversation.getSid()).setIdentity(identity).create();
    }
}
