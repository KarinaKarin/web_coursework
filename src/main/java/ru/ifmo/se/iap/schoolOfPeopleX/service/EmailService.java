package ru.ifmo.se.iap.schoolOfPeopleX.service;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.mail.Message;
import javax.mail.internet.MimeMessage;
import java.util.Collections;
import java.util.Set;

import static javax.mail.internet.InternetAddress.parse;

@Transactional
@Service
public class EmailService {
    private String sender = "noReplySchoolMansion@yandex.ru";

    private final JavaMailSender emailSender;

    public EmailService(JavaMailSender emailSender) {
        this.emailSender = emailSender;
    }

    public synchronized void sendMessage(String to, String subject, String content) {
        sendMessage(Collections.singleton(to), subject, content);
    }

    public synchronized void sendMessage(Set<String> to, String subject, String content) {
        MimeMessage message = emailSender.createMimeMessage();

        try {
            message.setFrom(sender);
            message.setRecipients(Message.RecipientType.TO, parse(String.join(",", to)));
            message.setSubject(subject);
            message.setContent(content, "text/html");
            emailSender.send(message);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
