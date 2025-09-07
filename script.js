// Galeri göster/gizle
function toggleGallery() {
    const gallery = document.getElementById('gallery');
    const button = document.querySelector('.toggle-btn');
    
    if (gallery.style.display === 'grid') {
        gallery.style.display = 'none';
        button.innerHTML = 'Randevu al <i class="fas fa-camera"></i>';
    } else {
        gallery.style.display = 'grid';
        button.innerHTML = 'Randevu al <i class="fas fa-times"></i>';
    }
}

// Termin formu göster/gizle
function toggleAppointmentForm() {
    const form = document.getElementById('appointment-form');
    
    if (form.style.display === 'block') {
        form.style.display = 'none';
    } else {
        form.style.display = 'block';
        // Formu görünür yapınca sayfayı kaydır
        form.scrollIntoView({ behavior: 'smooth' });
        // Saat seçeneklerini yükle
        loadTimeSlots();
    }
}

// Meşgul saatleri takip etmek için dizi
let busySlots = [];

// Saat seçeneklerini yükle
function loadTimeSlots() {
    const timeSelect = document.getElementById('time');
    const selectedDate = document.getElementById('date').value;
    
    // Önceki seçenekleri temizle
    timeSelect.innerHTML = '<option value="">Seçiniz</option>';
    
    // Çalışma saatleri: 09:00 - 18:00 arası, 30 dakikalık aralıklarla
    const startHour = 10;
    const endHour = 21;
    
    for (let hour = startHour; hour < endHour; hour++) {
        for (let minute = 0; minute < 60; minute += 40) {
            const timeValue = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            
            // Bu saat dilimi meşgul mu kontrol et
            const isBusy = busySlots.some(slot => 
                slot.date === selectedDate && slot.time === timeValue
            );
            
            if (!isBusy) {
                const option = document.createElement('option');
                option.value = timeValue;
                option.textContent = timeValue;
                timeSelect.appendChild(option);
            }
        }
    }
    
    // Eğer hiç uygun saat yoksa
    if (timeSelect.options.length === 1) {
        const option = document.createElement('option');
        option.value = "";
        option.textContent = "Bu tarihte uygun saat bulunamadı";
        option.disabled = true;
        timeSelect.appendChild(option);
    }
}

// Tarih değiştiğinde saat seçeneklerini güncelle
document.getElementById('date').addEventListener('change', loadTimeSlots);

// Form gönderme işlemi
document.getElementById('booking-form').addEventListener('submit', function(e) {
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    
    // Bu saat diliminin müsait olup olmadığını kontrol et
    const isSlotTaken = busySlots.some(slot => 
        slot.date === date && slot.time === time
    );
    
    if (isSlotTaken) {
        e.preventDefault();
        alert('Seçtiğiniz saat başka bir müşteri tarafından alınmış. Lütfen başka bir saat seçin.');
        loadTimeSlots(); // Saat seçeneklerini yenile
        return;
    }
    
    // Meşgul saatlere ekle
    busySlots.push({ date, time });
    
    // FormSubmit'in kendi işlemini yapmasına izin veriyoruz
    // Sadece kullanıcıya feedback veriyoruz
    alert('Randevu talebiniz alındı! En kısa sürede sizinle iletişime geçeceğiz.');
    
    // Formu temizleme ve gizleme işlemleri
    setTimeout(() => {
        this.reset();
        toggleAppointmentForm();
    }, 1000);
});

// Sayfa yüklendiğinde animasyonları tetikle
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.animated');
    
    animatedElements.forEach((element, index) => {
        setTimeout(() => {
            element.style.opacity = 1;
        }, 200 * index);
    });
    
    // Bugünün tarihinden önceki tarihleri engelle
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').setAttribute('min', today);
    
    // Saat gösterimi
    function updateClock() {
        const now = new Date();
        const clockElement = document.getElementById('clock');
        if (clockElement) {
            clockElement.textContent = now.toLocaleTimeString('de-DE');
        }
    }
    
    setInterval(updateClock, 1000);
    updateClock();
    
    
});