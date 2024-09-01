import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AuthService } from 'src/app/service/login/auth.service';
import anime from 'animejs/lib/anime.es.js';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {
    @ViewChild('animationCanvas', { static: true }) animationCanvas: ElementRef;

    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    error = '';

    constructor(
        public layoutService: LayoutService,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthService
    ) { }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });

        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    ngAfterViewInit() {
        this.initializeAnimation();
    }

    initializeAnimation() {
        const canvas = this.animationCanvas.nativeElement;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const numberOfPoints = 100;
        const points = [];
        const lines = [];

        // Create points
        for (let i = 0; i < numberOfPoints; i++) {
            points.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 2 + 1,
                vx: Math.random() * 2 - 1,
                vy: Math.random() * 2 - 1
            });
        }

        // Create lines
        for (let i = 0; i < 20; i++) {
            lines.push({
                x1: Math.random() * canvas.width,
                y1: Math.random() * canvas.height,
                x2: Math.random() * canvas.width,
                y2: Math.random() * canvas.height,
                vx1: Math.random() * 2 - 1,
                vy1: Math.random() * 2 - 1,
                vx2: Math.random() * 2 - 1,
                vy2: Math.random() * 2 - 1
            });
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Animate and draw points
            points.forEach(point => {
                point.x += point.vx;
                point.y += point.vy;

                if (point.x < 0 || point.x > canvas.width) point.vx *= -1;
                if (point.y < 0 || point.y > canvas.height) point.vy *= -1;

                ctx.beginPath();
                ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(200, 200, 200, 0.5)';
                ctx.fill();
            });

            // Animate and draw lines
            lines.forEach(line => {
                line.x1 += line.vx1;
                line.y1 += line.vy1;
                line.x2 += line.vx2;
                line.y2 += line.vy2;

                if (line.x1 < 0 || line.x1 > canvas.width) line.vx1 *= -1;
                if (line.y1 < 0 || line.y1 > canvas.height) line.vy1 *= -1;
                if (line.x2 < 0 || line.x2 > canvas.width) line.vx2 *= -1;
                if (line.y2 < 0 || line.y2 > canvas.height) line.vy2 *= -1;

                ctx.beginPath();
                ctx.moveTo(line.x1, line.y1);
                ctx.lineTo(line.x2, line.y2);
                ctx.strokeStyle = 'rgba(255, 100, 100, 0.3)';
                ctx.stroke();
            });

            requestAnimationFrame(animate);
        }

        animate();
    }

    get f() { return this.loginForm.controls; }

    onSubmit() {
        this.submitted = true;

        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;
        this.authService.login(this.f['email'].value, this.f['password'].value)
            .subscribe({
                next: () => {
                    this.router.navigate([this.returnUrl]);
                },
                error: error => {
                    this.error = error;
                    this.loading = false;
                }
            });
    }
}