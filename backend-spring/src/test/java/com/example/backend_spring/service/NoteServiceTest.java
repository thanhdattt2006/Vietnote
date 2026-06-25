package com.example.backend_spring.service;

import com.example.backend_spring.dto.request.NoteRequest;
import com.example.backend_spring.entity.Note;
import com.example.backend_spring.entity.User;
import com.example.backend_spring.repository.NoteRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class NoteServiceTest {

    @Mock
    private NoteRepository noteRepository;

    @InjectMocks
    private NoteService noteService;

    private User testUser;
    private Note testNote;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        testUser = User.builder()
                .id(1L)
                .username("test@gmail.com")
                .name("Test User")
                .role("user")
                .build();

        testNote = Note.builder()
                .id(100L)
                .title("Test Title")
                .content("<p>Test Content</p>")
                .isPinned(false)
                .owner(testUser)
                .build();
    }

    @Test
    void getActiveNotes_Success() {
        Page<Note> page = new PageImpl<>(List.of(testNote));
        when(noteRepository.findByOwnerOrderByIsPinnedDescUpdatedAtDesc(eq(testUser), any(PageRequest.class)))
                .thenReturn(page);

        Page<Note> result = noteService.getActiveNotes(testUser, 0, 10);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals("Test Title", result.getContent().get(0).getTitle());
    }

    @Test
    void createNote_Success() {
        NoteRequest request = new NoteRequest();
        request.setTitle("New Note");
        request.setContent("<p>New Content</p>");
        request.setIsPinned(true);

        when(noteRepository.save(any(Note.class))).thenAnswer(invocation -> {
            Note savedNote = invocation.getArgument(0);
            savedNote.setId(101L);
            return savedNote;
        });

        Note created = noteService.createNote(request, testUser);

        assertNotNull(created);
        assertEquals("New Note", created.getTitle());
        assertEquals("<p>New Content</p>", created.getContent());
        assertTrue(created.getIsPinned());
        assertEquals(testUser, created.getOwner());
    }

    @Test
    void updateNote_Success() {
        NoteRequest request = new NoteRequest();
        request.setTitle("Updated Title");

        when(noteRepository.findByIdAndOwner(100L, testUser)).thenReturn(Optional.of(testNote));
        when(noteRepository.save(any(Note.class))).thenReturn(testNote);

        Note updated = noteService.updateNote(100L, request, testUser);

        assertNotNull(updated);
        assertEquals("Updated Title", updated.getTitle());
    }

    @Test
    void updateNote_NotFound() {
        NoteRequest request = new NoteRequest();
        when(noteRepository.findByIdAndOwner(100L, testUser)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> {
            noteService.updateNote(100L, request, testUser);
        });
    }

    @Test
    void deleteToTrash_Success() {
        when(noteRepository.findByIdAndOwner(100L, testUser)).thenReturn(Optional.of(testNote));

        Map<String, String> response = noteService.deleteToTrash(100L, testUser);

        verify(noteRepository, times(1)).delete(testNote);
        assertEquals("Note moved to trash", response.get("message"));
    }
}
