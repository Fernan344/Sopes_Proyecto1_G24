FROM golang
WORKDIR /
COPY . .
RUN go mod download
ENV PORT 5000
EXPOSE 5000
CMD ["go", "run", "main.go"]