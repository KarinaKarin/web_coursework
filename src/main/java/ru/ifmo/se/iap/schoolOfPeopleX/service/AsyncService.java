package ru.ifmo.se.iap.schoolOfPeopleX.service;

import org.springframework.stereotype.Service;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Service
public class AsyncService {
    private final ExecutorService pool = Executors.newFixedThreadPool(8);

    public void async(Runnable runnable) {
        pool.execute(runnable);
    }
}
