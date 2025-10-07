# Instrukcje Deploymentu - GamePass Explorer

Aplikacja jest przygotowana do wdrożenia. Poniżej znajdziesz 3 najprostsze opcje:

---

## Opcja 1: GitHub Pages (Zalecane) 🚀

### Krok 1: Utwórz repozytorium na GitHub
1. Przejdź na https://github.com/new
2. Nazwij repozytorium np. `gamepass-explorer`
3. **NIE** zaznaczaj "Initialize with README"
4. Kliknij "Create repository"

### Krok 2: Wypchnij kod na GitHub
Wykonaj poniższe komendy w terminalu (w folderze projektu):

```powershell
git remote add origin https://github.com/TWOJA-NAZWA-UŻYTKOWNIKA/gamepass-explorer.git
git branch -M main
git push -u origin main
```

### Krok 3: Włącz GitHub Pages
1. Przejdź do Settings repozytorium
2. W menu po lewej wybierz "Pages"
3. W sekcji "Source" wybierz branch `main` i folder `/ (root)`
4. Kliknij "Save"

**Gotowe!** Aplikacja będzie dostępna pod adresem:
`https://TWOJA-NAZWA-UŻYTKOWNIKA.github.io/gamepass-explorer/`

---

## Opcja 2: Netlify Drop (Najszybsze - bez Git) ⚡

1. Przejdź na https://app.netlify.com/drop
2. Przeciągnij cały folder `gamepassexplorer` na stronę
3. **Gotowe!** Otrzymasz link typu `https://random-name-123.netlify.app`

### Aby zaktualizować:
- Przeciągnij folder ponownie na ten sam projekt w Netlify

---

## Opcja 3: Vercel (Szybkie z Git) 🔥

### Jeśli masz już kod na GitHub:
1. Przejdź na https://vercel.com/new
2. Zaloguj się przez GitHub
3. Wybierz repozytorium `gamepass-explorer`
4. Kliknij "Deploy"

**Gotowe!** Aplikacja będzie dostępna pod adresem Vercel.

---

## Aktualizacja aplikacji po deploymencie

### GitHub Pages / Vercel:
```powershell
git add .
git commit -m "Opis zmian"
git push
```

### Netlify Drop:
Przeciągnij zaktualizowany folder ponownie.

---

## Wskazówki

- **Aktualizacja games.json**: Po wdrożeniu możesz edytować plik `games.json` i wypchnąć zmiany
- **Domena własna**: Wszystkie 3 platformy pozwalają podłączyć własną domenę
- **HTTPS**: Wszystkie platformy automatycznie zapewniają HTTPS

---

## Status projektu

✅ Repozytorium Git zainicjalizowane
✅ Pliki dodane do Git
✅ Pierwszy commit wykonany
⏳ Czeka na deployment na wybraną platformę
