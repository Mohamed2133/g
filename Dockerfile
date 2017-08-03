
FROM microsoft/dotnet:1.1.1-runtime
#FROM microsoft/aspnetcore-build:1.1 AS build-env
WORKDIR /app


#RUN dotnet publish -c Release -o out
COPY . ./
# build runtime image


ENTRYPOINT ["dotnet", "Talabat.FrontEndDemo.Web.dll"]
